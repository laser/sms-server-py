SimpleMappingSystem
===================

About
-----

Python implementation of mapping system build while in the Peace Corps in
Honduras. Supports i18n. Uses Google (OAuth2) for authentication, RackSpace
CloudFiles for asset storage.

Installation
------------

Installing this application requires familiarity with *UNIX* system
administration and *Python* applications.

This application will run on any UNIX-based server. I've got it running on my
Mac with no problems.

To install the application and its dependencies on a Mac (with brew):

1. brew install git

2. brew install python

3. brew install mysql

4. Create a virtualenv somewhere

    ```
    mkdir ~/dev/sms
    cd ~/dev/sms
    virtualenv --no-site-packages
    ```

5. Check out the project:


    ```
    cd ~/dev/sms
    git clone git://github.com/hippipp/simplemappingsystem.com.git
    ```

6. Install dependencies, with pip

    ```
    cd ~/dev/sms
    source bin/activate
    pip install -r simplemappingsystem.com/requirements.txt
    ```

7. configure mysql and create a database (I called mine "radstuff")

8. run the .sql files in the SQL directory to create a DB and apply patches:

    ```
    cd ~/dev/sms/simplemappingsystem.com/sql
    mysql --user=whatever --password radstuff < schema.sql
    mysql --user=whatever --password radstuff < patch1.sql
    mysql --user=whatever --password radstuff < patch2.sql
    mysql --user=whatever --password radstuff < [...etc]
    ```

9. set environment variables

    ```
    export SMS_ENVIRONMENT=test
    export SMS_DEBUG=True
    export SMS_HOST=127.0.0.1
    export SMS_PORT=3002
    export SMS_DB_USER=root
    export SMS_DB_PASS=password
    export SMS_DB_NAME=radstuff
    export SMS_ENV_DOMAIN=somedomain.com
    export SMS_CLOUDFILES_USER=someuser
    export SMS_CLOUDFILES_API_KEY=someapikey
    export SMS_CLOUDFILES_CONTAINER_NAME=somedomain.com
    export SMS_FLASK_SECRET_KEY=somekey
    export SMS_OAUTH_CONSUMER_KEY=somedomain.com
    export SMS_OAUTH_CONSUMER_SECRET=somekey
    export SMS_SMTP_USER=fake@example.com
    export SMS_SMTP_PASSWORD=somepassword
    export SMS_SMTP_SERVER=someserver.com
    export SMS_SMTP_PORT=1234
    ```

10. generate Barrister contract & docs

    ```
    cd ~/dev/sms
    barrister -t "SimpleMappingSystem" -d sms.html -j sms.json idl/sms.idl
    ```

11. clone an sms client (view my other repos) into static/client and you're good to go
