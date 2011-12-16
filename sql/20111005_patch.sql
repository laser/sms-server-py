ALTER TABLE custom_position_properties RENAME TO position_fields;
ALTER TABLE position_fields CHANGE custom_position_property_id position_field_id int(11) NOT NULL;