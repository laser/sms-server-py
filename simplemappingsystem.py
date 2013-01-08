#!/usr/bin/env python

import os
import map_email
from jsonvalidator import JSONValidator, JSONValidationError
from utilities import dict_get, now_millis
from db import Db
from lepl.apps.rfc3696 import Email

############################################################################

class WebService():

    def __init__(self):
        db_user = dict_get(os.environ, 'DB_USER')
        db_pass = dict_get(os.environ, 'DB_PASS')
        db_name = dict_get(os.environ, 'DB_NAME')
        db = Db('127.0.0.1', 3306, db_user, db_pass, db_name)
        db.verbose = False
        self.db    = db
        self.db.commit()
        self.env_domain = dict_get(os.environ, 'ENV_DOMAIN')

    #####################################################################
    # public methods #
    ##################

    def user_login(self, req):
        schema = { "user_id" : "twitter-1234", "name" : "John Doe", "email" : "fake@gmail.com" }
        self.__validate(req, schema)

        # update user record with email and name
        sql = """
        INSERT INTO
            users (user_id, name, email, date_created)
        VALUES
            (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE name=%s, email=%s"""
        params = (req["user_id"], req["name"], req["email"], now_millis(), req["name"], req["email"])
        self.db.execute(sql, params)

        # update project access rows with the user_id
        sql = """
        UPDATE
            project_access
        SET
            user_id = %s
        WHERE
            email = %s"""
        params = (req["user_id"], req["email"])
        self.db.execute(sql, params)

    def user_get(self, req):
        schema = { "user_id": "google-987987123" }
        self.__validate(req, schema)
        return self.__get_user(req["user_id"])

    #####################################################################
    # message handlers #
    #####********#######

    def update_position(self, req):
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = (req["position_id"])
        self.db.execute(sql, params)
        project_id = self.__get_project_id_by_position_id(req["position_id"])
        self.__create_position_properties(project_id, req["position_id"], req["position_properties"])
        return self.__get_position_by_id(req["position_id"])

    def add_position_field(self, req):
        sql = """
        SELECT
            MAX(`order`)+1 as next_order
        FROM
            position_fields
        WHERE
            project_id=%s"""
        params = (req["project_id"])
        row = self.db.selectRow(sql, params)
        next_order = row["next_order"]

        sql = """
        INSERT INTO
            position_fields (project_id, name, field_type, visible, `order`)
        VALUES
            (%s, %s, %s, %s, %s)"""
        params = (req["project_id"], req["name"], req["field_type"], "Y", next_order)
        new_id = self.db.insertAutoIncrementRow(sql, params)
        return dict(
            position_field=dict(
                position_field_id=new_id,
                field_type=req["field_type"],
                name=req["name"],
                visible="Y"))

    def get_position_fields(self, req):
        sql = """
        SELECT
            a.position_field_id, a.field_type, a.name, a.visible
        FROM
            position_fields a
            INNER JOIN project_access b ON a.project_id = b.project_id
        WHERE
            a.project_id = %s
            AND b.user_id = %s
        ORDER BY
            a.order
        """
        
        params = (req["project_id"], req["user_id"])
        temp = self.db.selectAll(sql, params)
        temp_b = []
        position_fields = []

        if (req.has_key("suppress_core_fields") and req["suppress_core_fields"] == True):
            for position_field in temp:
                if (not "core_" in position_field["name"]):
                    temp_b.append(position_field)
        else:
            temp_b = temp

        if (req.has_key("suppress_field_types") and len(req["suppress_field_types"]) > 0):
            for position_field in temp_b:
                if (not position_field["field_type"] in req["suppress_field_types"]):
                    position_fields.append(position_field)
        else:
            position_fields = temp_b

        return dict(position_fields=position_fields)

    def get_project_access(self, req):
        schema = {
            "project_id": 1,
            "user_id": "google-123123123123"
        }
        self.__validate(req, schema)
        sql = """
        SELECT
            a.project_access_id, a.project_id, a.user_id, a.email, a.access_type
        FROM
            project_access a
        WHERE
            a.project_id = %s
            AND (a.user_id IS NULL OR a.user_id != %s)"""
        params = (req["project_id"], req['user_id'])
        project_access = self.db.selectAll(sql, params)
        return dict(project_access=project_access)
    
    def get_user_settings(self, req):
        user = self.__get_user(req["user_id"])
        user["needs_to_update_settings"] = self.__needs_to_update_settings(user)
        return user

    def update_user_settings(self, req):
        schema = {
            "default_language": "EN_US",
            "default_gps_format": "DECIMAL",
            "default_measurement_system": "IMPERIAL",
            "user_id": "google-123123123123",
            "default_google_map_type": "SATELLITE"
        }
        self.__validate(req, schema)

        sql = """
        UPDATE
            `users`
        SET
            default_language = %s,
            default_gps_format = %s,
            default_measurement_system = %s,
            default_google_map_type = %s
        WHERE
            user_id = %s"""

        params = (req["default_language"], req["default_gps_format"], req["default_measurement_system"], req["default_google_map_type"], req["user_id"])

        self.db.execute(sql, params)

        return True
    
    def get_projects(self, req):
        schema = {}
        self.__validate(req, schema)
        sql = """
        SELECT
            a.project_id, a.name, b.access_type
        FROM
            projects a
            INNER JOIN project_access b ON a.project_id = b.project_id
        WHERE
            b.user_id = %s"""
        params = (req["user_id"])
        return dict(projects=list(self.db.selectAll(sql, params)))

    def add_project(self, req):
        schema = {
            "name" : "radical badical",
            "user_id": "google-123123123123"
        }
        self.__validate(req, schema)
        sql = """
        INSERT INTO
            projects (user_id, name)
        VALUES
            (%s, %s)"""
        params = (req["user_id"], req["name"])
        new_id = self.db.insertAutoIncrementRow(sql, params)

        # give the user access to their own project
        sql = """
        INSERT INTO
            project_access (email, user_id, project_id, access_type)
        SELECT
            a.email, %s, %s, 'OWNER'
        FROM
            users a
        WHERE
            a.user_id = %s
        """
        params = (req["user_id"], new_id, req["user_id"])
        self.db.execute(sql, params)

        # add the "core" fields
        sql = """
        INSERT INTO
            position_fields (project_id, name, field_type, `order`, visible)
        VALUES
            (%s, %s, %s, %s, %s), (%s, %s, %s, %s, %s), (%s, %s, %s, %s, %s)
        """
        params = (new_id, "core_icon", "STRING", "0", "N", new_id, "core_latitude", "NUMBER", "1", "Y", new_id, "core_longitude", "NUMBER", "2", "Y")
        self.db.execute(sql, params)

        return dict(project=dict(project_id=new_id,name=req["name"]))

    def search_positions(self, req):
        self.__can_view_project(req["project_id"], req["user_id"])

        sql = """
        SELECT
            a.project_id,
            b.position_id,
            c.property_id,
            c.field_type,
            c.name,
            c.value,
            d.visible
        FROM
            projects a
            inner join positions b on a.project_id = b.project_id
            inner join position_properties c on b.position_id = c.position_id
            inner join position_fields d on c.name = d.name AND b.project_id = d.project_id
        WHERE"""

        if not req["keyword"]:
            sql += """
                a.project_id = %s
            ORDER BY
                b.position_id,
                d.order"""
            params = (req["project_id"])
        else:
            sql += """
                a.project_id = %s
                AND b.position_id in (
                    SELECT
                        d.position_id
                    FROM
                        position_properties d
                    WHERE
                        d.value like %s
                )
            ORDER BY
                b.position_id,
                d.order"""
            params = (req["project_id"], "%" + req["keyword"] + "%")

        rows = self.db.selectAll(sql, params)

        positions = dict()
        ret       = dict()
        
        for row in rows:
            if not positions.has_key(row["position_id"]):
                positions[row["position_id"]] = dict()

            positions[row["position_id"]]["position_id"] = row["position_id"]
            positions[row["position_id"]]["project_id"] = row["project_id"]

            if not positions[row["position_id"]].has_key("position_properties"):
                positions[row["position_id"]]["position_properties"] = list()

            m = dict()
            m["property_id"] = row["property_id"]
            m["field_type"]  = row["field_type"]
            m["name"]        = row["name"]
            m["value"]       = row["value"]
            m["visible"]     = row["visible"]

            positions[row["position_id"]]["position_properties"].append(m)

        ret["positions"] = list()
        for key in positions:
            ret["positions"].append(positions[key])

        return ret

    def add_position(self, req):
        sql = """
        INSERT INTO
            positions (user_id, project_id)
        VALUES
            (%s, %s)"""
        params = (req["user_id"], req["project_id"])
        new_position_id = self.db.insertAutoIncrementRow(sql, params)
        self.__create_position_properties(req["project_id"], new_position_id, req["position_properties"])

        return self.__get_position_by_id(new_position_id)

    def add_positions(self, req):
        ret  = dict(positions = list())
        temp = dict(user_id=req["user_id"], project_id=req["project_id"])
        for position in req["positions"]:
            temp["position_properties"] = position["position_properties"]
            ret["positions"].append(self.add_position(temp))
        return ret

    def delete_position_field(self, req):
        sql = """
        SELECT DISTINCT position_id, name
        FROM
            position_fields
            inner join positions on position_fields.project_id = positions.project_id
        WHERE
            position_field_id = %s
        """
        params = (req["position_field_id"])
        rows = self.db.selectAll(sql, params)

        for row in rows:
            sql = """
            DELETE FROM
                position_properties
            WHERE
                position_id = %s
                AND name = %s

            """
            params = (row["position_id"], row["name"])
            self.db.execute(sql, params)

        sql = """
        DELETE FROM
            position_fields
        WHERE
            position_field_id = %s
        """
        params = (req["position_field_id"])
        self.db.execute(sql, params)

        return True

    def delete_project_access(self, req):
        schema = {
            "user_id": "google-123123123123",
            "project_access_id": 1
        }
        self.__validate(req, schema)
        sql = """
        DELETE FROM
            project_access
        WHERE
            project_access_id = %s
        """
        params = (req["project_access_id"])
        self.db.execute(sql, params)

        return True

    def add_project_access(self, req):
        project_access = []
        user = self.__get_user(req["user_id"])
        access_type = req["access_type"]
        emails_validated = []
        link = "http://%s" % (self.env_domain)
        to_email = "simplemappingsystem@gmail.com"

        if (not access_type == "PUBLIC"):
            emails_validated = self.__strip_bad_emails(req["emails"])
            for i in range(len(emails_validated)):
                if (not emails_validated[i] == user["email"]):
                    # wipe access by emails
                    sql = """
                    DELETE FROM
                        project_access
                    WHERE
                        project_access.project_id = %s
                        AND project_access.email = %s
                    """
                    params = (req["project_id"], emails_validated[i])
                    self.db.execute(sql, params)

                    # get the user_id, if we have it in our system
                    user2 = self.__get_user_by_email(emails_validated[i])
                    if (user2 is None):
                        user2 = dict(user_id=None)

                    # add the new access rule
                    sql = """
                    INSERT INTO
                        project_access (project_id, user_id, email, access_type)
                    VALUES
                        (%s, %s, %s, %s)
                    """
                    params = (req["project_id"], user2["user_id"], emails_validated[i], req["access_type"])
                    project_access.append(dict(
                        project_access_id = self.db.insertAutoIncrementRow(sql, params),
                        project_id = req["project_id"],
                        email=emails_validated[i],
                        access_type=req["access_type"]
                    ))
        else:
            link = "http://%s/public/%s/%s/%s/%s/%s" % (self.env_domain, req["default_language"], req["default_gps_format"], req["default_measurement_system"], req["project_id"], req["default_google_map_type"])
            to_email = user["email"]
            
            # wipe previous public-access entry, if exists
            sql = """
            DELETE FROM
                project_access
            WHERE
                project_access.project_id = %s
                AND project_access.access_type = %s
            """
            params = (req["project_id"], "PUBLIC")
            self.db.execute(sql, params)

            # add the new access rule
            sql = """
            INSERT INTO
                project_access (project_id, access_type)
            VALUES
                (%s, %s)
            """
            params = (req["project_id"], "PUBLIC")
            project_access.append(dict(
                project_access_id = self.db.insertAutoIncrementRow(sql, params),
                project_id = req["project_id"],
                access_type=req["access_type"],
                link = link
            ))

        message = u"""%s:\n\r%s\n\r%s""" % (user["name"], req["message"], link)
        map_email.mail(to_email, [], emails_validated, "SimpleMappingSystem.com", message)
        return project_access

    def delete_position(self, req):
        schema = {
            "user_id": "google-123123123123",
            "position_id": 1
        }
        self.__validate(req, schema)
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = (req["position_id"])
        self.db.execute(sql, params)

        sql = """
        DELETE FROM
            positions
        WHERE
            position_id = %s
        """
        params = (req["position_id"])
        self.db.execute(sql, params)

        return True

    def update_position_fields(self, req):
        i = 0
        for position_field in req["position_fields"]:
            sql = """
            UPDATE
                position_fields
            SET
                visible = %s,
                `order` = %s
            WHERE
                position_field_id = %s
            """
            params = (position_field["visible"], i, position_field["position_field_id"])
            self.db.execute(sql, params)
            i = i + 1

        return True

    def delete_project(self, o):
        sql = """DELETE FROM project_access WHERE project_id = %s"""
        params = o["project_id"]
        self.db.execute(sql, params)

        sql = """DELETE FROM position_fields WHERE project_id = %s"""
        params = o["project_id"]
        self.db.execute(sql, params)

        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id IN (
                SELECT
                    position_id
                FROM
                    positions
                WHERE
                    positions.project_id = %s
            )
        """
        params = o["project_id"]
        self.db.execute(sql, params)

        sql = """DELETE FROM positions WHERE project_id = %s"""
        params = o["project_id"]
        self.db.execute(sql, params)

        sql = """DELETE FROM projects WHERE project_id = %s"""
        params = o["project_id"]
        self.db.execute(sql, params)

        return True

    #####################################################################
    # private #
    ###########

    def __strip_bad_emails(self, emails_unvalidated):
        email_validator = Email()
        emails_validated = []
        for i in range(len(emails_unvalidated)):
            if email_validator(emails_unvalidated[i]):
                emails_validated.append(emails_unvalidated[i])
        return emails_validated

    def __validate(self, req, schema):
        validator = JSONValidator(schema)
        try:
            validator.validate(req)
        except JSONValidationError, e:
            msg = "%s - Example of valid message: %s" % (str(e), str(schema))
            raise JSONValidationError(msg)

    def __is_email(self, d, key):
        return d.has_key(key) and d[key] and d[key].find("@") > 0

    def __needs_to_update_settings(self, user):
        needsToUpdate = not (
            (user.has_key("default_language") and user["default_language"])
            or (user.has_key("default_gps_format") and user["default_gps_format"])
            or (user.has_key("default_measurement_system") and user["default_measurement_system"])
        )
        return needsToUpdate

    def __create_position_properties(self, project_id, position_id, position_properties):
        types_by_name = self.__get_position_field_types(project_id)
        for i in range(len(position_properties)):
            type = types_by_name[position_properties[i]["name"]]
            sql = """
            INSERT INTO
                position_properties (position_id, field_type, name, value)
            VALUES
                (%s, %s, %s, %s)"""
            params = (position_id, type, position_properties[i]["name"], position_properties[i]["value"])
            position_properties[i]["property_id"] = self.db.insertAutoIncrementRow(sql, params)
            position_properties[i]["field_type"] = type

    def __get_position_field_types(self, project_id):
        sql = """
        SELECT
            a.name,
            a.field_type
        FROM
            position_fields a
        WHERE
            a.project_id = %s
        """
        rows = self.db.selectAll(sql, project_id)
        info = dict()
        for row in rows:
            info[row['name']] = row['field_type']
        return info

    def __get_user(self, user_id):
        sql = """
        SELECT
            *
        FROM
            `users`
        WHERE
            user_id=%s"""
        params = (user_id)
        return self.db.selectRow(sql, params)

    def __get_user_by_email(self, email):
        sql = """
        SELECT
            *
        FROM
            `users`
        WHERE
            email=%s"""
        params = (email)
        return self.db.selectRow(sql, params)

    def __get_project_id_by_position_id(self, position_id):
        sql = """
        SELECT DISTINCT
            project_id
        FROM
            positions
        WHERE
            position_id=%s"""
        params = (position_id)
        temp = self.db.selectRow(sql, params)
        return temp["project_id"]

    def __can_view_project(self, project_id, user_id=None):
        can_view = False
        sql = """
        SELECT DISTINCT
            user_id, access_type
        FROM
            project_access
        WHERE
            project_id=%s"""
        params = (project_id)
        rows = self.db.selectAll(sql, params)
        for row in rows:
            if (user_id and row["user_id"] == user_id):
                can_view = True
                break
            elif (row["access_type"] == "PUBLIC"):
                can_view = True
                break                

        if (not can_view):
            message = "Insufficient privileges to view project %s" % (project_id)
            raise Exception, message

    def __get_position_by_id(self, position_id):
        sql = """
        SELECT
            a.project_id,
            b.position_id,
            c.property_id,
            c.field_type,
            c.name,
            c.value,
            d.visible
        FROM
            projects a
            inner join positions b on a.project_id = b.project_id
            inner join position_properties c on b.position_id = c.position_id
            inner join position_fields d on c.name = d.name AND b.project_id = d.project_id
        WHERE
            b.position_id = %s
        ORDER BY
            d.order"""

        params = (position_id)
        rows = self.db.selectAll(sql, params)

        position = dict()
        position["position_id"] = position_id
        position["position_properties"] = list()

        for row in rows:
            m = dict()
            m["property_id"]       = row["property_id"]
            m["field_type"]        = row["field_type"]
            m["name"]              = row["name"]
            m["value"]             = row["value"]
            m["visible"]           = row["visible"]
            position["project_id"] = row["project_id"]
            position["position_properties"].append(m)

        return position