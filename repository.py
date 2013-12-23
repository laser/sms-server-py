#!/usr/bin/env python

import os
import barrister

from utilities import dict_get, now_millis
from lepl.apps.rfc3696 import Email

############################################################################

class Repository():

    def __init__(self, db, mail_service):
        self.db = db
        self.mail_service = mail_service
        self.env_domain = dict_get(os.environ, 'SMS_ENV_DOMAIN')
        self.required_position_field_names = {"core_icon", "core_latitude", "core_longitude"}

    def update_position(self, access_token, position_id, properties):
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = (position_id)
        self.db.execute(sql, params)
        project_id = self.__get_project_id_by_position_id(position_id)
        self.__create_position_properties(project_id, position_id, properties)

        return self.__get_position_by_id(position_id)

    def add_position_field(self, access_token, project_id, field_type, name):
        sql = """
        SELECT
            MAX(`order`)+1 as next_order
        FROM
            position_fields
        WHERE
            project_id=%s"""
        params = (project_id)
        row = self.db.selectRow(sql, params)
        next_order = row["next_order"]

        sql = """
        INSERT INTO
            position_fields (project_id, name, field_type, visible, `order`)
        VALUES
            (%s, %s, %s, %s, %s)"""
        params = (project_id, name, field_type, "Y", next_order)
        new_id = self.db.insertAutoIncrementRow(sql, params)

        return dict(position_field_id=new_id, field_type=field_type, name=name, visible="Y")

    def get_position_fields(self, access_token, project_id, suppress_core_fields, suppress_field_types):
        sql = """
        SELECT
            a.position_field_id, a.field_type, a.name, a.visible
        FROM
            position_fields a
        WHERE
            a.project_id = %s
        ORDER BY
            a.order
        """

        params = (project_id)
        temp = self.db.selectAll(sql, params)
        temp_b = []
        position_fields = []

        if (suppress_core_fields == True):
            for position_field in temp:
                if (not "core_" in position_field["name"]):
                    temp_b.append(position_field)
        else:
            temp_b = temp

        if (len(suppress_field_types) > 0):
            for position_field in temp_b:
                if (not position_field["field_type"] in suppress_field_types):
                    position_fields.append(position_field)
        else:
            position_fields = temp_b

        return list(position_fields)

    def get_project_access(self, access_token, project_id):
        sql = """
        SELECT
            a.project_access_id, a.project_id, a.user_id, a.email, a.access_type
        FROM
            project_access a
        WHERE
            a.project_id = %s"""
        params = (project_id)
        project_access = self.db.selectAll(sql, params)

        return list(project_access)

    def get_user_settings(self, access_token):
        user = self.__get_user_by_access_token(access_token)
        user["needs_to_update_settings"] = self.__needs_to_update_settings(user)

        return user

    def update_user_settings(self, access_token, default_language, default_gps_format, default_measurement_system, default_google_map_type):
        user_id = self.__get_user_by_access_token(access_token)["user_id"]

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
        params = (default_language, default_gps_format, default_measurement_system, default_google_map_type, user_id)
        self.db.execute(sql, params)

        return True

    def get_projects(self, access_token):
        user = self.__get_user_by_access_token(access_token)

        sql = """
        SELECT
            a.project_id, a.name, b.access_type
        FROM
            projects a
            INNER JOIN project_access b ON a.project_id = b.project_id
        WHERE
            b.user_id = %s"""
        params = (user.get("user_id"))

        return list(self.db.selectAll(sql, params))

    def add_project(self, access_token, project_name):
        user = self.__get_user_by_access_token(access_token)

        sql = """
        INSERT INTO
            projects (user_id, name)
        VALUES
            (%s, %s)"""
        params = (user.get("user_id"), project_name)
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
        params = (user.get("user_id"), new_id, user.get("user_id"))
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

        return dict(project_id=new_id,name=project_name)

    def search_positions(self, access_token, project_id, keyword):
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

        if not keyword:
            sql += """
                a.project_id = %s
            ORDER BY
                b.position_id,
                d.order"""
            params = (project_id)
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
            params = (project_id, "%" + keyword + "%")

        rows = self.db.selectAll(sql, params)

        positions = dict()
        ret       = list()

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

        for key in positions:
            ret.append(positions[key])

        return ret

    def add_position(self, access_token, project_id, properties):
        user_id = self.__get_user_by_access_token(access_token)["user_id"]

        if (not self.__has_required_fields(properties)):
            raise barrister.RpcException(1004, "Must include core fields")
        else:
            if (not self.__has_valid_field_names(access_token, project_id, properties)):
                raise barrister.RpcException(1004, "Can not include properties with names that don't correspond to fields for this project")
            else:
                if (not self.__has_core_field_values(properties)):
                    raise barrister.RpcException(1002, "Must include values for core fields")
                else:
                    sql = """
                    INSERT INTO
                        positions (user_id, project_id)
                    VALUES
                        (%s, %s)"""
                    params = (user_id, project_id)
                    new_position_id = self.db.insertAutoIncrementRow(sql, params)
                    self.__create_position_properties(project_id, new_position_id, properties)

                    return self.__get_position_by_id(new_position_id)

    def add_positions(self, access_token, project_id, positions):
        ret  = list()
        for position in positions:
            ret.append(self.add_position(access_token, project_id, position["position_properties"]))

        return ret

    def delete_position_field(self, access_token, position_field_id):
        sql = """
        SELECT DISTINCT position_id, name
        FROM
            position_fields
            inner join positions on position_fields.project_id = positions.project_id
        WHERE
            position_field_id = %s
        """
        params = (position_field_id)
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
        params = (position_field_id)
        self.db.execute(sql, params)

        return True

    def delete_project_access(self, access_token, project_access_id):
        existing = self.__get_project_access_by_id(project_access_id)

        if (len(existing) > 0 and existing[0]["access_type"] == "OWNER"):
            raise barrister.RpcException(1004, "Can't revoke OWNER ProjectAccess")
        else:
            sql = """
            DELETE FROM
                project_access
            WHERE
                project_access_id = %s
            """
            params = (project_access_id)
            self.db.execute(sql, params)

            return True

    def add_project_access(self, access_token, project_id, access_type, language, measurement_sys, gps_format, map_type, message, emails):
        user = self.__get_user_by_access_token(access_token)
        user_id = user.get("user_id")

        if (len(emails) == 0 and access_type != "PUBLIC"):
            raise barrister.RpcException(1002, "TRANSLATE: Must specify at least one email address if access_type is not PUBLIC")
        elif (access_type == "OWNER"):
            raise barrister.RpcException(1004, "Can't add OWNER ProjectAccess")
        else:
            project_access = []
            access_type = access_type
            emails_validated = []
            link = "http://%s" % (self.env_domain)
            to_email = "simplemappingsystem@gmail.com"

            if (not access_type == "PUBLIC"):
                emails_validated = self.__strip_bad_emails(emails)
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
                        params = (project_id, emails_validated[i])
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
                        params = (project_id, user2["user_id"], emails_validated[i], access_type)
                        project_access.append(dict(
                            project_access_id = self.db.insertAutoIncrementRow(sql, params),
                            project_id = project_id,
                            email=emails_validated[i],
                            access_type=access_type
                        ))
            else:
                link = "http://%s/#/public/%s/%s/%s/%s/%s" % (self.env_domain, language, gps_format, measurement_sys, project_id, map_type)
                to_email = user["email"]

                # wipe previous public-access entry, if exists
                sql = """
                DELETE FROM
                    project_access
                WHERE
                    project_access.project_id = %s
                    AND project_access.access_type = %s
                """
                params = (project_id, "PUBLIC")
                self.db.execute(sql, params)

                # add the new access rule
                sql = """
                INSERT INTO
                    project_access (project_id, access_type)
                VALUES
                    (%s, %s)
                """
                params = (project_id, "PUBLIC")
                project_access.append(dict(
                    project_access_id = self.db.insertAutoIncrementRow(sql, params),
                    project_id = project_id,
                    access_type=access_type,
                    link = link
                ))

            message = u"""%s:\n\r%s\n\r%s""" % (user["name"], message, link)
            self.mail_service.mail(to_email, [], emails_validated, "SimpleMappingSystem.com", message)
            return project_access

    def delete_position(self, access_token, position_id):
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = (position_id)
        self.db.execute(sql, params)

        sql = """
        DELETE FROM
            positions
        WHERE
            position_id = %s
        """
        params = (position_id)
        self.db.execute(sql, params)

        return True

    def update_position_fields(self, access_token, position_fields):
        i = 0
        for position_field in position_fields:
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

    def delete_project(self, access_token, project_id):
        sql = """DELETE FROM project_access WHERE project_id = %s"""
        params = project_id
        self.db.execute(sql, params)

        sql = """DELETE FROM position_fields WHERE project_id = %s"""
        params = project_id
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
        params = project_id
        self.db.execute(sql, params)

        sql = """DELETE FROM positions WHERE project_id = %s"""
        params = project_id
        self.db.execute(sql, params)

        sql = """DELETE FROM projects WHERE project_id = %s"""
        params = project_id
        self.db.execute(sql, params)

        return True

    #####################################################################
    # private #
    ###########

    def __has_core_field_values(self, properties):
        core_properties = filter(lambda p: p["name"] in self.required_position_field_names, properties)

        return len(filter(lambda cp: len(cp["value"]) > 0, core_properties)) >= 3

    def __has_valid_field_names(self, access_token, project_id, properties):
        provided_names  = set(p["name"] for p in properties)
        available_names = set(f["name"] for f in self.get_position_fields(access_token, project_id, False, []))

        return len(provided_names.intersection(available_names)) >= len(provided_names)

    def __get_project_access_by_id(self, project_access_id):
        sql = """
        SELECT
            a.project_access_id, a.project_id, a.user_id, a.email, a.access_type
        FROM
            project_access a
        WHERE
            a.project_access_id = %s"""

        return list(self.db.selectAll(sql, project_access_id))

    def __has_required_fields(self, properties):
        provided_names  = set(p["name"] for p in properties)

        return len(provided_names.intersection(self.required_position_field_names)) >= 3

    def __strip_bad_emails(self, emails_unvalidated):
        email_validator = Email()
        emails_validated = []
        for i in range(len(emails_unvalidated)):
            if email_validator(emails_unvalidated[i]):
                emails_validated.append(emails_unvalidated[i])
        return emails_validated

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

    def __get_user_by_access_token(self, access_token):
        sql = """
        SELECT
            a.*
        FROM
            `users` a
            INNER JOIN `logins` b ON a.user_id = b.user_id
        WHERE
            b.access_token=%s
        """
        params = (access_token)

        r = self.db.selectRow(sql, params)

        return r

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
