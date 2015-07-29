#!/usr/bin/env python

import boto
import uuid
import os


from werkzeug.utils import secure_filename

from hostingservice import HostingService

############################################################################

class CloudFilesService(HostingService):

    #####################################################################
    # public methods #
    ##################

    def host_file(self, source_file, retries=3):
        source_filename = secure_filename(source_file.filename)
        source_extension = os.path.splitext(source_filename)[1]

        destination_filename = uuid.uuid4().hex + source_extension

        # Connect to S3 and upload file.
        conn = boto.connect_s3(os.environ['SMS_AWS_ACCESS_KEY_ID'], os.environ['SMS_AWS_SECRET_ACCESS_KEY'])
        b = conn.get_bucket(os.environ['SMS_S3_BUCKET'])

        sml = b.new_key(destination_filename)
        sml.set_contents_from_string(source_file.read())
        sml.set_acl('public-read')

        return sml.generate_url(expires_in=0, query_auth=False, force_http=True)

    #####################################################################
    # private methods #
    #####################################################################

    def __get_rackspace_storage_container(self):
        return self._container
