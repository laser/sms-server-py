#!/usr/bin/env python

import os
import map_email
import barrister
import uuid

from utilities import dict_get, now_millis
from db import Db
from lepl.apps.rfc3696 import Email

############################################################################

class AuthService():

    def __init__(self):
        db_user = dict_get(os.environ, 'DB_USER')
        db_pass = dict_get(os.environ, 'DB_PASS')
        db_name = dict_get(os.environ, 'DB_NAME')
        db = Db('127.0.0.1', 3306, db_user, db_pass, db_name)
        db.verbose = False
        self.db    = db
        self.db.commit()
        
        self.token_ttl_millis = 86400000 # 24 hours

    #####################################################################
    # public methods #
    ##################

    def login(self, user_id, email, name):

        # update user record with email and name
        sql = """
        INSERT INTO
            users (user_id, name, email, date_created)
        VALUES
            (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE name=%s, email=%s"""
        params = (user_id, name, email, now_millis(), name, email)
        self.db.execute(sql, params)

        # update project access rows with the user_id
        sql = """
        UPDATE
            project_access
        SET
            user_id = %s
        WHERE
            email = %s"""
        params = (user_id, email)
        
        # generate an access token
        token_id = uuid.uuid4()
        expiry_time = now_millis() + self.token_ttl_millis
        sql = """
        INSERT INTO
            `logins` (access_token, user_id, expiry_time)
        VALUES
            (%s, %s, %s)
        """
        params = (token_id, user_id, expiry_time)
        self.db.execute(sql, params)

        return {
            "token_id": token_id,
            "expiry_time": expiry_time
        }
