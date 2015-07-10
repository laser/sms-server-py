#!/usr/bin/env python

# third-party libs
from utilities import dict_get
from oauth2client import client
from apiclient import discovery
from werkzeug.contrib.fixers import ProxyFix

import os
import barrister
import pdb
import flask
import json
import httplib2

# internal libs
from repository import Repository
from db import Db
from projectservice import ProjectService
from authservice import AuthService

app = flask.Flask(__name__)
app.secret_key = dict_get(os.environ, 'SMS_FLASK_SECRET_KEY')
app.wsgi_app = ProxyFix(app.wsgi_app)

#################################################################
# app config #
##############

environment = dict_get(os.environ, 'SMS_ENVIRONMENT')

#################################################################
# db config #
#############

db_url = dict_get(os.environ, 'DATABASE_URL')

#################################################################
# smtp #
########

env_domain    = dict_get(os.environ, 'SMS_ENV_DOMAIN')
smtp_user     = dict_get(os.environ, 'SMS_SMTP_USER')
smtp_password = dict_get(os.environ, 'SMS_SMTP_PASSWORD')
smtp_server   = dict_get(os.environ, 'SMS_SMTP_SERVER')
smtp_port     = dict_get(os.environ, 'SMS_SMTP_PORT')

#################################################################
# rackspace cloud files #
#########################

cloud_user           = dict_get(os.environ, 'SMS_CLOUDFILES_USER')
cloud_api_key        = dict_get(os.environ, 'SMS_CLOUDFILES_API_KEY')
cloud_container_name = dict_get(os.environ, 'SMS_CLOUDFILES_CONTAINER_NAME')

#################################################################
# services #
############

if environment == 'test':
    from hostingservice import HostingService
    from mailservice import MailService

    class FakeEmailService(MailService):
        def mail(*arg): None

    class FakeHostingService(HostingService):
        def host_file(*arg): None

    hosting_service = FakeHostingService()
    mail_service    = FakeEmailService()
else:
    from smtpservice import SMTPService
    from cloud import CloudFilesService
    hosting_service = CloudFilesService(cloud_user, cloud_api_key, cloud_container_name)
    mail_service    = SMTPService(smtp_user, smtp_password, smtp_server, smtp_port)

db             = Db(db_url)
repository     = Repository(db, mail_service)
projectService = ProjectService(env_domain, mail_service, repository)
authService    = AuthService(db)

#################################################################
# barrister #
#############

contract = barrister.contract_from_file('sms.json')
server   = barrister.Server(contract)
server.add_handler('AuthService', authService)
server.add_handler('ProjectService', projectService)

#################################################################
# request handlers #
####################

@app.route('/api', methods=['POST'])
def api():
    if __authenticated(flask.request.data):
        return server.call_json(flask.request.data)
    else:
        raise barrister.RpcException(1000, 'User is not logged in')

@app.route('/')
def index():
    return app.send_static_file('client/index.html')

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    return json.dumps(dict(status='success', uri=__host_file(flask.request.files['Filedata'])))

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/login')
def login():
    return flask.redirect(flask.url_for('oauth2callback'))

@app.route('/logout')
def logout():
    return flask.redirect(flask.url_for('index'))

@app.route('/oauth2callback')
def oauth2callback(): 
    flow = client.flow_from_clientsecrets(
        'client_secrets.json',
        scope='https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        redirect_uri=flask.url_for('oauth2callback', _external=True),)

    if 'code' not in flask.request.args:
        auth_uri = flow.step1_get_authorize_url()
        return flask.redirect(auth_uri)
    else:
        auth_code = flask.request.args.get('code')
        credentials = flow.step2_exchange(auth_code)
        if credentials.access_token_expired:
            return flask.redirect(flask.url_for('oauth2callback'))
        else:
            http_auth = credentials.authorize(httplib2.Http())
            users_service = discovery.build('oauth2', 'v2', http=http_auth)
            user_info = users_service.userinfo().get().execute()
            return __on_login('google', user_info['id'], user_info['name'], user_info['email'])        

#################################################################
# misc private #
################
def __authenticated(request_data):
    data = json.loads(request_data)
    #if (data.get('method') != 'barrister-idl'):
    return True

def __on_login(provider, provider_user_id, name, email):
    user_id      = '%s-%s' % (provider, provider_user_id)
    login_info   = authService.login(user_id, email, name)
    user         = projectService.get_user_settings(login_info.get('access_token'))
    url          = '#/private/%s/%s' % (login_info.get('access_token'), user['default_language'] or '')

    return flask.redirect(flask.url_for('index') + url);

def __host_file(file):
    file_uri = hosting_service.host_file(file)
    return file_uri

#################################################################
# main #
########

if __name__ == '__main__':
    app.run()
