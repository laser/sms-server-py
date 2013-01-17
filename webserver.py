#!/usr/bin/env python

from flask import Flask, session, redirect, render_template, url_for
from flask import request, flash, jsonify
from oauthlib import OAuth
from simplemappingsystem import WebService
from cloud import CloudFilesService
from utilities import dict_get

import os
import barrister
import pdb

app = Flask(__name__)
app.secret_key = dict_get(os.environ, "FLASK_SECRET_KEY")

#################################################################
# garmin communicator #
########**************#

garmin_domain = dict_get(os.environ, "GARMIN_DOMAIN")
garmin_key = dict_get(os.environ, "GARMIN_KEY")

#################################################################
# oauth #
#########

oauth = OAuth()

google = oauth.remote_app(
    'google',
    base_url='https://www.googleapis.com/auth/',
    request_token_url='https://www.google.com/accounts/OAuthGetRequestToken',
    access_token_url='https://www.google.com/accounts/OAuthGetAccessToken',
    authorize_url='https://www.google.com/accounts/OAuthAuthorizeToken',
    consumer_key=dict_get(os.environ, "OAUTH_CONSUMER_KEY"),
    consumer_secret=dict_get(os.environ, "OAUTH_CONSUMER_SECRET"),
    request_token_params =
        {'scope':'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'})

#################################################################
# service #
#########

cloudFilesService = CloudFilesService()
service  = WebService()

#################################################################
# barrister #
#############

contract = barrister.contract_from_file("sms.json")
server   = barrister.Server(contract)
server.add_handler("SimpleMappingSystem", service)

#################################################################
# request handlers #
####################

@app.route('/api', methods=['POST'])
def sms():
    return server.call_json(request.data)

@app.route('/')
def index():
    passthrough = dict()
    user_id = dict_get(session, 'user_id')
    passthrough["site"] = dict(garmin_domain = garmin_domain, garmin_key = garmin_key)
    if (not user_id is None):
        user = service.user_get({ 'user_id' : user_id })
        passthrough["user"] = user
    else:
        passthrough["user"] = dict(user_id=user_id)
        passthrough["user"]['default_language'] = "EN_US"
    return render_template('index.html', passthrough = passthrough)

@app.route('/public/<default_language>/<default_gps_format>/<default_measurement_system>/<project_id>/', methods=['GET'])
@app.route('/public/<default_language>/<default_gps_format>/<default_measurement_system>/<project_id>/<default_google_map_type>', methods=['GET'])
def show_public_project(project_id, default_language, default_gps_format, default_measurement_system, default_google_map_type="SATELLITE"):
    return render_template('public.html', public = dict(
            project_id = project_id,
            default_language = default_language,
            default_gps_format = default_gps_format,
            default_measurement_system = default_measurement_system,
            default_google_map_type = default_google_map_type
    ))

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    return jsonify(dict(status="success", uri=__save_file_to_cloud(request.files['Filedata'])))

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")

@app.route('/login')
def login():
    provider = 'google'
    session.pop('user_id', None)
    session.pop('oauth_token', None)
    p = oauth.remote_apps["google"]
    return p.authorize(callback=url_for('login_authorized_google'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('oauth_token', None)
    return redirect(url_for('index'))

@app.route('/login_authorized_google')
@google.authorized_handler
def login_authorized_google(resp):
    if resp is None:
        return redirect(url_for('login'))
    else:
        session['oauth_token'] = (resp['oauth_token'],
                                  resp['oauth_token_secret'])
        resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json')
        email = resp.data['email']
        user_id = resp.data['id']
        name = resp.data['name']
        return __on_login('google', user_id, name, email)

@google.tokengetter
def get_oauth_token_google():
    return session.get('oauth_token')

#################################################################
# misc private #
################

def __on_login(provider, user_id, name, email):
    user_id = '%s-%s' % (provider, user_id)
    session['user_id'] = user_id
    service.user_login({ 'user_id' : user_id, 'name' : name, 'email' : email })
    __load_user()
    return redirect(url_for('index'))

def __load_user():
    request.user = None
    if session.has_key('user_id'):
        resp = service.user_get({ 'user_id' : session['user_id'] })
        if resp.has_key('user_id'):
            request.user = resp

def __save_file_to_cloud(file):
    return cloudFilesService.save_file_to_rackspace(file)

#################################################################
# main #
########

if __name__ == '__main__':
    debug = bool(dict_get(os.environ, "DEBUG"))
    host  = dict_get(os.environ, "HOST")
    port  = int(dict_get(os.environ, "PORT"))
    print "Running Flask server [%s, %s, %s]" % (debug, host, port)
    app.run(debug=debug, host=host, port=port)
