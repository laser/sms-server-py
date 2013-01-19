#!/usr/bin/env python

from flask import Flask, redirect, render_template, url_for, g
from flask import request, flash, jsonify
from oauthlib import OAuth
from service import WebService
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

@app.before_request
def before_request():
    g.user = None

@app.route('/api', methods=['POST'])
def sms():
    return server.call_json(request.data)

@app.route('/')
def index():
    return app.send_static_file("client/index.html")

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    return jsonify(dict(status="success", uri=__save_file_to_cloud(request.files['Filedata'])))

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")

@app.route('/login')
def login():
    p = oauth.remote_apps["google"]
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
        return __on_login('google', resp.data["id"], resp.data["name"], resp.data["email"])

@google.tokengetter
def get_oauth_token_google():
    return g.user

#################################################################
# misc private #
################

def __on_login(provider, provider_user_id, name, email):
    user_id = '%s-%s' % (provider, provider_user_id)
    service.user_login({ 'user_id' : user_id, 'name' : name, 'email' : email })
    user = service.user_get({ 'user_id' : user_id })
    url = "#/private/%s/%s" % (user_id, user["default_language"])
    
    return redirect(url_for("index") + url);

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
