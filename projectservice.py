#!/usr/bin/env python

import os
import barrister

from utilities import dict_get, now_millis
from lepl.apps.rfc3696 import Email

############################################################################

class ProjectService():

    def __init__(self, mail_service, repository):
        self.repository = repository
        self.mail_service = mail_service
        self.required_position_field_names = {"core_icon", "core_latitude", "core_longitude"}

    def update_position(self, access_token, position_id, properties):
        return self.repository.update_position(access_token, position_id, properties)

    def add_position_field(self, access_token, project_id, field_type, name):
        return self.repository.add_position_field(access_token, project_id, field_type, name)

    def get_position_fields(self, access_token, project_id, suppress_core_fields, suppress_field_types):
        return self.repository.get_position_fields(access_token, project_id, suppress_core_fields, suppress_field_types)

    def get_project_access(self, access_token, project_id):
        return self.repository.get_project_access(access_token, project_id)

    def get_user_settings(self, access_token):
        return self.repository.get_user_settings(access_token)

    def update_user_settings(self, access_token, default_language, default_gps_format, default_measurement_system, default_google_map_type):
        return self.repository.update_user_settings(access_token, default_language, default_gps_format, default_measurement_system, default_google_map_type)

    def get_projects(self, access_token):
        return self.repository.get_projects(access_token)

    def add_project(self, access_token, project_name):
        return self.repository.add_project(access_token, project_name)

    def search_positions(self, access_token, project_id, keyword):
        return self.repository.search_positions(access_token, project_id, keyword)

    def add_position(self, access_token, project_id, properties):
        return self.repository.add_position(access_token, project_id, properties)

    def add_positions(self, access_token, project_id, positions):
        return self.repository.add_positions(access_token, project_id, positions)

    def delete_position_field(self, access_token, position_field_id):
       return self.repository.delete_position_field(access_token, position_field_id)

    def delete_project_access(self, access_token, project_access_id):
       return self.repository.delete_project_access(access_token, project_access_id)

    def add_project_access(self, access_token, project_id, access_type, language, measurement_sys, gps_format, map_type, message, emails):
       return self.repository.add_project_access(access_token, project_id, access_type, language, measurement_sys, gps_format, map_type, message, emails)

    def delete_position(self, access_token, position_id):
       return self.repository.delete_position(access_token, position_id)

    def update_position_fields(self, access_token, position_fields):
       return self.repository.update_position_fields(access_token, position_fields)

    def delete_project(self, access_token, project_id):
        return self.repository.delete_project(access_token, project_id)
