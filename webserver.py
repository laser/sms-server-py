#!/usr/bin/env python

from flask import Flask, redirect, render_template, url_for, g
from flask import request, flash, jsonify
from oauthlib import OAuth
from utilities import dict_get

from projectservice import ProjectService
from authservice import AuthService
from map_email import SMTPService
from cloud import CloudFilesService


import os
import barrister
import pdb
import json

app = Flask(__name__)
app.secret_key = dict_get(os.environ, 'SMS_FLASK_SECRET_KEY')

#################################################################
# app config #
##############

debug = bool(dict_get(os.environ, 'SMS_DEBUG'))
host  = dict_get(os.environ, 'SMS_HOST')
port  = int(dict_get(os.environ, 'SMS_PORT'))

#################################################################
# garmin communicator #
#######################

garmin_domain = dict_get(os.environ, 'SMS_GARMIN_DOMAIN')
garmin_key    = dict_get(os.environ, 'SMS_GARMIN_KEY')

#################################################################
# smtp #
########

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
# oauth #
#########

oauth_consumer_key    = dict_get(os.environ, 'SMS_OAUTH_CONSUMER_KEY')
oauth_consumer_secret = dict_get(os.environ, 'SMS_OAUTH_CONSUMER_SECRET')

oauth = OAuth()

google = oauth.remote_app(
    'google',
    base_url='https://www.googleapis.com/auth/',
    request_token_url='https://www.google.com/accounts/OAuthGetRequestToken',
    access_token_url='https://www.google.com/accounts/OAuthGetAccessToken',
    authorize_url='https://www.google.com/accounts/OAuthAuthorizeToken',
    consumer_key=oauth_consumer_key,
    consumer_secret=oauth_consumer_secret,
    request_token_params =
        {'scope':'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'})

#################################################################
# services #
############

hostingService  = CloudFilesService(cloud_user, cloud_api_key, cloud_container_name)
mailService     = SMTPService(smtp_user, smtp_password, smtp_server, smtp_port)
projectService  = ProjectService(mailService)
authService     = AuthService()

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

@app.before_request
def before_request():
    g.user = None

@app.route('/api', methods=['POST'])
def sms():
    if __authenticated(request.data):
        return server.call_json(request.data)
    else:
        raise barrister.RpcException(1000, 'User is not logged in')

@app.route('/')
def index():
    return app.send_static_file('client/index.html')

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    return jsonify(dict(status='success', uri=__host_file(request.files['Filedata'])))

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/login')
def login():
    p = oauth.remote_apps['google']
    return p.authorize(callback=url_for('login_authorized_google'))

@app.route('/logout')
def logout():
    return redirect(url_for('index'))

@app.route('/login_authorized_google')
@google.authorized_handler
def login_authorized_google(resp):
    if resp is None:
        return redirect(url_for('index'))
    else:
        g.user = (resp['oauth_token'], resp['oauth_token_secret'])
        resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json')
        return __on_login('google', resp.data['id'], resp.data['name'], resp.data['email'])

@google.tokengetter
def get_oauth_token_google():
    return g.user

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

    return redirect(url_for('index') + url);

def __host_file(file):
    file_uri = hostingService.host_file(file)
    return file_uri

#################################################################
# main #
########

if __name__ == '__main__':
    print 'Running Flask server [%s, %s, %s]' % (debug, host, port)
    app.run(debug=debug, host=host, port=port)
