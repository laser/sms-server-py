#!/usr/bin/env python

import cloudfiles
import uuid
import os
from hostingservice import HostingService

############################################################################
from utilities import dict_get

class CloudFilesService(HostingService):

    def __init__(self, cloud_user, cloud_api_key, cloud_container_name):
        self.conn               = cloudfiles.get_connection(username=cloud_user, api_key=cloud_api_key, timeout=15)
        self._container         = self.conn.get_container(cloud_container_name)
        self._test_process_time = 0

    #####################################################################
    # public methods #
    ##################

    def host_file(self, file, retries=3):
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


    #####################################################################
    # private methods #
    #####################################################################

    def __get_rackspace_storage_container(self):
        return self._container
