ALTER TABLE `users` MODIFY COLUMN default_language enum('EN_US', 'ES_LA', 'FR_FR');
ALTER TABLE custom_position_properties ADD COLUMN visible enum('Y','N') DEFAULT 'Y' NOT NULL;
