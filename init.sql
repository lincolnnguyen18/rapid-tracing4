DROP DATABASE IF EXISTS rapid_tracing;
CREATE DATABASE rapid_tracing;
USE rapid_tracing;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pictures (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  filename TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_records (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  minutes REAL NOT NULL,
  -- trace BLOB NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_pictures (
  user_id INTEGER NOT NULL,
  picture_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (picture_id) REFERENCES pictures(id)
);

CREATE TABLE IF NOT EXISTS picture_timerecords (
  picture_id INTEGER NOT NULL,
  timerecord_id INTEGER NOT NULL,
  FOREIGN KEY (picture_id) REFERENCES pictures(id),
  FOREIGN KEY (timerecord_id) REFERENCES time_records(id)
);

DELIMITER //
CREATE PROCEDURE register_user(_username VARCHAR(255), _password TEXT) BEGIN
  INSERT INTO users (username, password) VALUES (_username, _password);
END //
CREATE PROCEDURE add_picture(_filename TEXT, _user_id INTEGER) BEGIN
  INSERT INTO pictures (filename) VALUES (_filename);
  INSERT INTO user_pictures (user_id, picture_id) VALUES (_user_id, LAST_INSERT_ID());
END//
DELIMITER ;