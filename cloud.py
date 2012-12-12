#!/usr/bin/env python

import cloudfiles
import uuid
import os

############################################################################
from utilities import dict_get

class CloudFilesService():

    def __init__(self):
        cf_user                 = dict_get(os.environ, 'CLOUDFILES_USER')
        cf_api_key              = dict_get(os.environ, 'CLOUDFILES_API_KEY')
        self.conn               = cloudfiles.get_connection(username=cf_user, api_key=cf_api_key, timeout=15)
        self._container         = self.conn.get_container(dict_get(os.environ, 'CLOUDFILES_CONTAINER_NAME'))
        self._test_process_time = 0

    #####################################################################
    # public methods #
    ##################

    def save_file_to_rackspace(self, file, retries=3):
        if retries > 0:
            container = self.__get_rackspace_storage_container()
            obj = container.create_object(str(uuid.uuid4()))
            try:
                obj.send(file)
            except:
                print "Retrying... " + str(retries) + " retries left."
                retries = retries - 1
                self.save_file_to_rackspace(file, retries)
            return obj.public_uri()
        else:
            raise Exception("Unable to save file (" + file + ") to CloudFiles storage.")
            

    def get_uri_list(self):
        container = self.__get_rackspace_storage_container()
        files = []
        for object in container.get_objects():
            files.append(dict(uri=object.public_uri()))
        return files

    #####################################################################
    # private methods #
    #####################################################################

    def __get_rackspace_storage_container(self):
        return self._container