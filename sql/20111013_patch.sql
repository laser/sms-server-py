INSERT INTO position_fields (project_id, name, field_type, `order`, visible)
SELECT projects.project_id, "core_icon", "STRING", 0, "Y" from projects where project_id not in (select distinct project_id from position_fields where name like 'core%')
UNION ALL SELECT projects.project_id, "core_latitude", "NUMBER", 0, "Y" from projects where project_id not in (select distinct project_id from position_fields where name like 'core%')
UNION ALL SELECT projects.project_id, "core_longitude", "NUMBER", 0, "Y" from projects where project_id not in (select distinct project_id from position_fields where name like 'core%');

UPDATE position_fields set field_type = "NUMBER" where name in ("core_latitude", "core_longitude");