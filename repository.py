#!/usr/bin/env python

############################################################################

class Repository():

    def __init__(self, db, mail_service):
        self.db = db
        self.mail_service = mail_service
        self.required_position_field_names = {"core_icon", "core_latitude", "core_longitude"}

    def delete_position_field(self, position_field_id):
        sql = """
        SELECT DISTINCT position_id, name
        FROM
            position_fields
            inner join positions on position_fields.project_id = positions.project_id
        WHERE
            position_field_id = %s
        """
        params = [position_field_id]
        rows = self.db.selectAll(sql, params)

        for row in rows:
            sql = """
            DELETE FROM
                position_properties
            WHERE
                position_id = %s
                AND name = %s

            """
            params = [row["position_id"], row["name"]]
            self.db.execute(sql, params)

        sql = """
        DELETE FROM
            position_fields
        WHERE
            position_field_id = %s
        """
        params = [position_field_id]
        self.db.execute(sql, params)

        return True

    def search_positions(self, project_id, keyword):
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
            params = [project_id]
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
            params = [project_id, "%" + keyword + "%"]

        return self.db.selectAll(sql, params)


    def delete_project(self, project_id):
        sql = """DELETE FROM project_access WHERE project_id = %s"""
        params = [project_id]
        self.db.execute(sql, params)

        sql = """DELETE FROM position_fields WHERE project_id = %s"""
        params = [project_id]
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
        params = [project_id]
        self.db.execute(sql, params)

        sql = """DELETE FROM positions WHERE project_id = %s"""
        params = [project_id]
        self.db.execute(sql, params)

        sql = """DELETE FROM projects WHERE project_id = %s"""
        params = [project_id]
        self.db.execute(sql, params)

        return True

    def update_position_field(self, position_field_id, visible, order):
        sql = """
        UPDATE
            position_fields
        SET
            visible = %s,
            `order` = %s
        WHERE
            position_field_id = %s
        """
        params = [visible, order, position_field_id]
        self.db.execute(sql, params)

    def delete_position(self, position_id):
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = [position_id]
        self.db.execute(sql, params)

        sql = """
        DELETE FROM
            positions
        WHERE
            position_id = %s
        """
        params = [position_id]
        self.db.execute(sql, params)

        return True

    def get_user_by_email(self, email):
        sql = """
        SELECT
            *
        FROM
            `users`
        WHERE
            email=%s"""
        params = [email]
        return self.db.selectRow(sql, params)

    def delete_position_property(self, position_id):
        sql = """
        DELETE FROM
            position_properties
        WHERE
            position_id = %s
        """
        params = [position_id]
        self.db.execute(sql, params)

    def get_next_position_field_order(self, project_id):
        sql = """
        SELECT
            MAX(`order`)+1 as next_order
        FROM
            position_fields
        WHERE
            project_id=%s"""
        params = [project_id]
        row = self.db.selectRow(sql, params)
        next_order = row["next_order"]
        return next_order

    def get_position_fields(self, project_id):
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

        params = [project_id]
        return list(self.db.selectAll(sql, params))

    def get_project_access_by_project_id(self, project_id):
        sql = """
        SELECT
            a.project_access_id, a.project_id, a.user_id, a.email, a.access_type
        FROM
            project_access a
        WHERE
            a.project_id = %s"""
        params = [project_id]
        project_access = self.db.selectAll(sql, params)

        return list(project_access)

    def update_user_settings(self, user_id, default_language, default_gps_format, default_measurement_system, default_google_map_type):
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

        params = [default_language, default_gps_format, default_measurement_system, default_google_map_type, user_id]
        self.db.execute(sql, params)

        return True

    def get_projects(self, user_id):
        sql = """
        SELECT
            a.project_id, a.name, b.access_type
        FROM
            projects a
            INNER JOIN project_access b ON a.project_id = b.project_id
        WHERE
            b.user_id = %s"""
        params = [user_id]

        return list(self.db.selectAll(sql, params))

    def create_project(self, user_id, project_name):
        sql = """
        INSERT INTO
            projects (user_id, name)
        VALUES
            (%s, %s)"""
        params = [user_id, project_name]

        return self.db.insertAutoIncrementRow(sql, params)

    def create_project_access(self, project_id, access_type, user_id=None, email=None):
        sql = ""

        if (user_id != None and email != None):
            sql = """
            INSERT INTO
                project_access (email, user_id, project_id, access_type)
            VALUES
                (%s, %s, %s, %s)
            """
            params = [email, user_id, project_id, access_type]
        elif (user_id != None and email == None):
            sql = """
            INSERT INTO
                project_access (user_id, project_id, access_type)
            VALUES
                (%s, %s, %s)
            """
            params = [user_id, project_id, access_type]
        elif (user_id == None and email != None):
            sql = """
            INSERT INTO
                project_access (email, project_id, access_type)
            VALUES
                (%s, %s, %s)
            """
            params = [email, project_id, access_type]
        else:
            sql = """
            INSERT INTO
                project_access (project_id, access_type)
            VALUES
                (%s, %s)
            """
            params = [project_id, access_type]

        return self.db.insertAutoIncrementRow(sql, params)

    def create_position_field(self, project_id, name, field_type, order, visible):
        sql = """
        INSERT INTO
            position_fields (project_id, name, field_type, `order`, visible)
        VALUES
            (%s, %s, %s, %s, %s)
        """
        params = [project_id, name, field_type, order, visible]
        new_id = self.db.insertAutoIncrementRow(sql, params)

        return dict(position_field_id=new_id, field_type=field_type, name=name, visible=visible)

    def create_position(self, user_id, project_id):
        sql = """
        INSERT INTO
            positions (user_id, project_id)
        VALUES
            (%s, %s)"""

        params = [user_id, project_id]
        return self.db.insertAutoIncrementRow(sql, params)

    def delete_project_access(self, project_access_id):
        sql = """
        DELETE FROM
            project_access
        WHERE
            project_access.project_access_id = %s
        """
        params = [project_access_id]
        self.db.execute(sql, params)

        return True

    def get_user_by_access_token(self, access_token):
        sql = """
        SELECT
            a.*
        FROM
            `users` a
            INNER JOIN `logins` b ON a.user_id = b.user_id
        WHERE
            b.access_token=%s
        """
        params = [access_token]

        return self.db.selectRow(sql, params)

    def get_position_field_types(self, project_id):
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

    def create_position_property(self, position_id, field_type, name, value):
        sql = """
        INSERT INTO
            position_properties (position_id, field_type, name, value)
        VALUES
            (%s, %s, %s, %s)"""
        params      = [position_id, field_type, name, value]
        property_id = self.db.insertAutoIncrementRow(sql, params)

        return property_id

    def get_project_id_by_position_id(self, position_id):
        sql = """
        SELECT DISTINCT
            project_id
        FROM
            positions
        WHERE
            position_id=%s"""
        params = [position_id]
        temp = self.db.selectRow(sql, params)
        return temp["project_id"]

    def get_project_access_by_id(self, project_access_id):
        sql = """
        SELECT
            a.project_access_id, a.project_id, a.user_id, a.email, a.access_type
        FROM
            project_access a
        WHERE
            a.project_access_id = %s"""

        return list(self.db.selectAll(sql, project_access_id))

    def get_position_by_id(self, position_id):
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

        params = [position_id]

        return self.db.selectAll(sql, params)
