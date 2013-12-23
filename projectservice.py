#!/usr/bin/env python

import os
import barrister
import code

from utilities import dict_get, now_millis
from lepl.apps.rfc3696 import Email

############################################################################

class ProjectService():

    def __init__(self, mail_service, repository):
        self.repository = repository
        self.mail_service = mail_service
        self.env_domain = dict_get(os.environ, 'SMS_ENV_DOMAIN')
        self.required_position_field_names = {"core_icon", "core_latitude", "core_longitude"}

    def update_position(self, access_token, position_id, properties):
        return self.repository.update_position(position_id, properties)

    def add_position_field(self, access_token, project_id, field_type, name):
        next_order = self.repository.get_next_position_field_order(project_id)
        return self.repository.create_position_field(project_id, name, field_type, next_order, 'Y')

    def get_position_fields(self, access_token, project_id, suppress_core_fields, suppress_field_types):
        temp = self.repository.get_position_fields(project_id)
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
        return self.repository.get_project_access_by_project_id(project_id)

    def update_user_settings(self, access_token, default_language, default_gps_format, default_measurement_system, default_google_map_type):
        user_id = self.repository.get_user_by_access_token(access_token)["user_id"]
        return self.repository.update_user_settings(user_id, default_language, default_gps_format, default_measurement_system, default_google_map_type)

    def get_projects(self, access_token):
        user = self.repository.get_user_by_access_token(access_token)
        return self.repository.get_projects(user.get('user_id'))

    def add_project(self, access_token, project_name):
        # create the shell project
        user = self.repository.get_user_by_access_token(access_token)
        user_id = user.get('user_id')
        new_id = self.repository.create_project(user_id, project_name)

        # give the user access to their project
        self.repository.create_project_access(new_id, 'OWNER', user_id)

        # add the "core" fields
        self.repository.create_position_field(new_id, 'core_icon', 'STRING', '0', 'N')
        self.repository.create_position_field(new_id, 'core_latitude', 'NUMBER', '1', 'Y')
        self.repository.create_position_field(new_id, 'core_longitude', 'NUMBER', '2', 'Y')

        return dict(project_id=new_id,name=project_name)

    def search_positions(self, access_token, project_id, keyword):
        rows      = self.repository.search_positions(project_id, keyword)
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
        user_id = self.repository.get_user_by_access_token(access_token)["user_id"]

        if (not self.__has_required_fields(properties)):
            raise barrister.RpcException(1004, "Must include core fields")

        if (not self.__has_valid_field_names(access_token, project_id, properties)):
            raise barrister.RpcException(1004, "Can not include properties with names that don't correspond to fields for this project")

        if (not self.__has_core_field_values(properties)):
            raise barrister.RpcException(1002, "Must include values for core fields")

        new_position_id = self.repository.create_position(user_id, project_id)
        self.__create_position_properties(project_id, new_position_id, properties)

        return self.get_position_by_id(new_position_id)

    def add_positions(self, access_token, project_id, positions):
        ret  = list()
        for position in positions:
            ret.append(self.add_position(access_token, project_id, position["position_properties"]))

        return ret

    def delete_position_field(self, access_token, position_field_id):
       return self.repository.delete_position_field(position_field_id)

    def delete_project_access(self, access_token, project_access_id):
        existing = self.repository.get_project_access_by_id(project_access_id)

        if (len(existing) > 0 and existing[0]["access_type"] == "OWNER"):
            raise barrister.RpcException(1004, "Can't revoke OWNER ProjectAccess")

        return self.repository.delete_project_access(project_access_id)

    def delete_position(self, access_token, position_id):
        return self.repository.delete_position(position_id)

    def update_position_fields(self, access_token, position_fields):
        i = 0
        for position_field in position_fields:
            self.repository.update_position_field(position_field['position_field_id'], position_field['visible'], i)
            i = i + 1

        return True

    def delete_project(self, access_token, project_id):
        return self.repository.delete_project(project_id)

    def get_position_by_id(self, position_id):
        rows = self.repository.get_position_by_id(position_id)

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

    def update_position(self, access_token, position_id, properties):
        self.repository.delete_position_property(position_id)
        project_id = self.repository.get_project_id_by_position_id(position_id)
        self.__create_position_properties(project_id, position_id, properties)

        return self.get_position_by_id(position_id)

    def get_user_settings(self, access_token):
        user = self.repository.get_user_by_access_token(access_token)
        user["needs_to_update_settings"] = self.__needs_to_update_settings(user)

        return user

    def add_project_access(self, access_token, project_id, access_type, language, measurement_sys, gps_format, map_type, message, emails):
        user = self.repository.get_user_by_access_token(access_token)
        user_id = user.get("user_id")
        existing_project_accesses = self.repository.get_project_access_by_project_id(project_id)

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
                        for id in filter(lambda x: x['email'] == emails_validated[i], existing_project_accesses):
                          self.repository.delete_project_access(id)

                        # get the user_id, if we have it in our system
                        user2 = self.repository.get_user_by_email(emails_validated[i])
                        if (user2 is None):
                            user2 = dict(user_id=None)

                        # add the new access rule
                        new_id = self.repository.create_project_access(project_id, access_type, user2['user_id'], emails_validated[i])

                        project_access.append(dict(
                            project_access_id = new_id,
                            project_id = project_id,
                            email=emails_validated[i],
                            access_type=access_type
                        ))
            else:
                link = "http://%s/#/public/%s/%s/%s/%s/%s" % (self.env_domain, language, gps_format, measurement_sys, project_id, map_type)
                to_email = user["email"]

                # wipe previous public-access entry, if exists
                for id in filter(lambda x: x['access_type'] == 'PUBLIC', existing_project_accesses):
                  self.repository.delete_project_access(id)

                # add the new access rule
                new_id = self.repository.create_project_access(project_id, 'PUBLIC')
                project_access.append(dict(
                    project_access_id = new_id,
                    project_id = project_id,
                    access_type=access_type,
                    link = link
                ))

            message = u"""%s:\n\r%s\n\r%s""" % (user["name"], message, link)
            self.mail_service.mail(to_email, [], emails_validated, "SimpleMappingSystem.com", message)
            return project_access

    # private

    def __needs_to_update_settings(self, user):
        needsToUpdate = not (
            (user.has_key("default_language") and user["default_language"])
            or (user.has_key("default_gps_format") and user["default_gps_format"])
            or (user.has_key("default_measurement_system") and user["default_measurement_system"])
        )

        return needsToUpdate

    def __create_position_properties(self, project_id, position_id, position_properties):
        types_by_name = self.repository.get_position_field_types(project_id)
        for i in range(len(position_properties)):
            field_type = types_by_name[position_properties[i]["name"]]
            name       = position_properties[i]["name"]
            value      = position_properties[i]["value"]
            self.repository.create_position_property(position_id, field_type, name, value)

    def __has_core_field_values(self, properties):
        core_properties = filter(lambda p: p["name"] in self.required_position_field_names, properties)

        return len(filter(lambda cp: len(cp["value"]) > 0, core_properties)) >= 3

    def __has_required_fields(self, properties):
        provided_names  = set(p["name"] for p in properties)

        return len(provided_names.intersection(self.required_position_field_names)) >= 3

    def __has_valid_field_names(self, access_token, project_id, properties):
        provided_names  = set(p["name"] for p in properties)
        available_names = set(f["name"] for f in self.get_position_fields(access_token, project_id, False, []))

        return len(provided_names.intersection(available_names)) >= len(provided_names)

    def __strip_bad_emails(self, emails_unvalidated):
        email_validator = Email()
        emails_validated = []
        for i in range(len(emails_unvalidated)):
            if email_validator(emails_unvalidated[i]):
                emails_validated.append(emails_unvalidated[i])

        return emails_validated
