CREATE TABLE `logins` (
    login_id                  int(11) NOT NULL PRIMARY KEY auto_increment,
    access_token              varchar(64),
    user_id                   varchar(128),
    expiry_time               bigint(20),
    FOREIGN KEY (user_id) REFERENCES `users` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT into `logins` (access_token, user_id, expiry_time) VALUES ("test-token", "test-user", 1577836800000);
