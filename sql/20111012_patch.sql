UPDATE position_properties SET name = "core_latitude" where name = "latitude";
UPDATE position_properties SET name = "core_longitude" where name = "longitude";
UPDATE position_properties SET name = "core_icon" where name = "icon";

INSERT INTO position_fields (project_id, name, field_type, `order`, visible)
SELECT DISTINCT positions.project_id, position_properties.name, position_properties.field_type, 0 as `order`, "Y" as visible from position_properties inner join positions on position_properties.position_id = positions.position_id left outer join position_fields on position_properties.name = position_fields.name AND positions.project_id = position_fields.project_id where position_fields.name is null;

UPDATE position_fields SET visible = "N" where name = "core_icon";