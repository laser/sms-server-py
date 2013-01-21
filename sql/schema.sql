drop table if exists `logins`;
drop table if exists `position_fields`;
drop table if exists `custom_position_properties`;
drop table if exists `position_properties`;
drop table if exists `positions`;
drop table if exists `project_access`;
drop table if exists `projects`;
drop table if exists `users`;

CREATE TABLE `users` (
    user_id                   varchar(128) NOT NULL PRIMARY KEY,
    email                     varchar(128) NULL UNIQUE,
    `name`                    varchar(255) NULL,
    date_created              bigint NOT NULL,
    default_language          enum('EN_US', 'ES_LA', 'FR_FR'),
    default_gps_format        enum('DECIMAL', 'DEGREE', 'UTMWGS84'),
    default_measurement_system enum('METRIC', 'IMPERIAL')
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `projects` (
    project_id                int(11) NOT NULL PRIMARY KEY auto_increment,
    user_id                   varchar(128) NOT NULL,
    `name`                    varchar(32),
    FOREIGN KEY (user_id) REFERENCES `users` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `positions` (
    position_id               int(11) NOT NULL PRIMARY KEY auto_increment,
    user_id                   varchar(128) NOT NULL,
    project_id                int(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `users` (user_id),
    FOREIGN KEY (project_id) REFERENCES `projects` (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `position_properties` (
    -- holds values, for both custom and core
    property_id               int(11) NOT NULL PRIMARY KEY auto_increment,
    position_id               int(11) NOT NULL,
    field_type                enum('NUMBER','STRING','IMAGE','IMAGE_LIST') NOT NULL DEFAULT 'STRING',
    `name`                    varchar(32) NOT NULL,
    `value`                   varchar(4096) NOT NULL,
    FOREIGN KEY (position_id) REFERENCES `positions` (position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `custom_position_properties` (
    custom_position_property_id int(11) NOT NULL PRIMARY KEY auto_increment,
    project_id                int(11) NOT NULL,
    `name`                    varchar(32) NOT NULL,
    field_type                enum('NUMBER','STRING','IMAGE','IMAGE_LIST') NOT NULL,
    `order`                   int(11),
    FOREIGN KEY (project_id) REFERENCES `projects` (project_id),
    CONSTRAINT UNIQUE uni_nameProjectId (`name`, project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `project_access` (
    project_access_id         int(11) NOT NULL PRIMARY KEY auto_increment,
    project_id                int(11) NOT NULL,
    user_id                   varchar(128),
    email                     varchar(128),
    access_type               enum('OWNER', 'READONLY', 'PUBLIC'),
    FOREIGN KEY (project_id) REFERENCES `projects` (project_id),
    CONSTRAINT UNIQUE uni_emailProjectId (`email`, project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
