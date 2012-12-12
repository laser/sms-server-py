SimpleMappingSystem
===================


About
-----

Web-based (the Cloud!) mapping system written to support field engineers while serving in the Peace Corps in Honduras. Supports localization (English, Spanish, French currently translated; easy to add more), Garmin GPS device integration, multiple geocordinate systems (UTM, DMS, Degree-Decimal), image galleries, custom metadata, and permissioning. OAuth for login, CloudFiles for asset storage.


Releases
--------

I'm continuously deploying, or whatever.


Installation
------------

Installing this application requires familiarity with *UNIX* system administration and *Python* applications.

This application will run on any UNIX-based server. I've got it running on my Mac with no problems.

To install the application and its dependencies on a Mac (with brew):

1. brew install git

2. brew install python

3. brew install mysql

4. Create a virtualenv somewhere

    mkdir ~/dev/sms
    cd ~/dev/sms
    virtualenv --no-site-packages

5. Check out the project:

    cd ~/dev/sms
    git clone git://github.com/hippipp/simplemappingsystem.com.git

6. Install dependencies, with pip

    cd ~/dev/sms
    source bin/activate
    pip install -r simplemappingsystem.com/requirements.txt
    deactivate

7. configure mysql and create a database (I called mine "radstuff")

8. run the .sql files in the SQL directory to create a DB and apply patches:

    cd ~/dev/sms/simplemappingsystem.com/sql
    mysql --user=whatever --password radstuff < schema.sql
    mysql --user=whatever --password radstuff < patch1.sql
    mysql --user=whatever --password radstuff < patch2.sql
    mysql --user=whatever --password radstuff < [...etc]

9. to run the app (env variables must be set, somehow):

    cd ~/dev/sms
    source bin/activate
    bin/python simplemappingsystem.com/app.py


Environmental variables
-----------------------

The following environment variables will need to be set in order for the app to work. How you get them set is up to you (I wrote a simple Bash script, run.sh).

export DEBUG=<bool>
export HOST=<string>
export PORT=<number>
export DB_USER=<string>
export DB_PASS=<string>
export DB_NAME=<string>
export ENV_DOMAIN=<string>
export GMAIL_USER=<string>
export GMAIL_PWD=<string>
export UPLOADS_DEFAULT_DEST=<string>
export CLOUDFILES_USER=<string>
export CLOUDFILES_API_KEY=<string>
export CLOUDFILES_CONTAINER_NAME=<string>
export GARMIN_DOMAIN=<string>
export GARMIN_KEY=<string>
export FLASK_SECRET_KEY=<string>
export OAUTH_CONSUMER_KEY=<string>
export OAUTH_CONSUMER_SECRET=<string>


Copyright
---------

Copyright (c) 2011-2013 Erin Swenson-Healey