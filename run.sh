#! /bin/bash
source bin/activate

export DEBUG=True
export HOST=127.0.0.1
export PORT=3002
export DB_USER=root
export DB_PASS=password
export DB_NAME=radstuff
export ENV_DOMAIN=somedomain.com
export GMAIL_USER=someaddress@gmail.com
export GMAIL_PWD=somepassword
export UPLOADS_DEFAULT_DEST=/var/www/somedomain.com/temp
export CLOUDFILES_USER=someuser
export CLOUDFILES_API_KEY=someapikey
export CLOUDFILES_CONTAINER_NAME=somedomain.com
export GARMIN_DOMAIN=http://somedomain.com/
export GARMIN_KEY=somekey
export FLASK_SECRET_KEY=somekey
export OAUTH_CONSUMER_KEY=somedomain.com
export OAUTH_CONSUMER_SECRET=somekey

../bin/python app.py
