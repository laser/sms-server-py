-- cascade updates to user_id to projects

ALTER TABLE `projects` DROP FOREIGN KEY projects_ibfk_1;

ALTER TABLE `projects`
  ADD CONSTRAINT projects_ibfk_1 FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- same thing for positions

ALTER TABLE `positions` DROP FOREIGN KEY positions_ibfk_1;

ALTER TABLE `positions`
  ADD CONSTRAINT positions_ibfk_1 FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- and logins, too

ALTER TABLE `logins` DROP FOREIGN KEY logins_ibfk_1;

ALTER TABLE `logins`
  ADD CONSTRAINT logins_ibfk_1 FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- remove the 'google-' prefix from user_id, since we use only google

UPDATE users SET user_id = replace(user_id, 'google-', '')