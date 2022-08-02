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
  extension TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_records (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  seconds INT NOT NULL,
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
CREATE PROCEDURE register_user(_username VARCHAR(255), _password TEXT, OUT user_id INT) BEGIN
  INSERT INTO users (username, password) VALUES (_username, _password);
  SET user_id = LAST_INSERT_ID();
END //

CREATE PROCEDURE add_picture(_filename TEXT, _extension TEXT, _user_id INTEGER) BEGIN
  INSERT INTO pictures (filename, extension) VALUES (_filename, _extension);
  INSERT INTO user_pictures (user_id, picture_id) VALUES (_user_id, LAST_INSERT_ID());
END//

CREATE PROCEDURE delete_picture(_picture_id INTEGER, _user_id INTEGER) BEGIN
  SELECT filename FROM pictures WHERE id = _picture_id;
  DELETE FROM user_pictures WHERE user_id = _user_id AND picture_id = _picture_id;
  DELETE FROM picture_timerecords WHERE picture_id = _picture_id;
  DELETE FROM pictures WHERE id = _picture_id;
END//

CREATE PROCEDURE get_user_pictures(_user_id INTEGER) BEGIN
  SELECT DISTINCT ISNULL(timerecord_id) as is_new, pictures.id, filename, extension FROM pictures
  JOIN user_pictures ON pictures.id = user_pictures.picture_id
  LEFT JOIN picture_timerecords ON pictures.id = picture_timerecords.picture_id
  WHERE user_pictures.user_id = _user_id
  ORDER BY pictures.id DESC;
END//

CREATE PROCEDURE get_picture_last_timerecord(_user_id INTEGER, _picture_id INTEGER) BEGIN
  SELECT time_records.seconds FROM time_records
    JOIN picture_timerecords ON time_records.id = picture_timerecords.timerecord_id
    JOIN user_pictures ON picture_timerecords.picture_id = user_pictures.picture_id
    WHERE user_pictures.user_id = _user_id AND user_pictures.picture_id = _picture_id AND picture_timerecords.picture_id = _picture_id
    ORDER BY time_records.id DESC LIMIT 1;
END//

CREATE PROCEDURE add_time_record(_seconds INT, _user_id INTEGER, _picture_id INTEGER) BEGIN
  SET @picture_belong_to_user = (SELECT COUNT(*) FROM user_pictures WHERE user_id = _user_id AND picture_id = _picture_id);
  IF @picture_belong_to_user = 1 THEN
    INSERT INTO time_records (seconds) VALUES (_seconds);
    INSERT INTO picture_timerecords (picture_id, timerecord_id) VALUES (_picture_id, LAST_INSERT_ID());
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Picture does not belong to user';
  END IF;
END//

CREATE PROCEDURE get_user_picture_time_records(_user_id INTEGER, _picture_id INTEGER) BEGIN
  SELECT time_records.id, seconds, time_records.created_at FROM time_records
  JOIN picture_timerecords ON time_records.id = picture_timerecords.timerecord_id 
  JOIN user_pictures ON picture_timerecords.picture_id = user_pictures.picture_id
  WHERE user_pictures.user_id = _user_id AND user_pictures.picture_id = _picture_id AND picture_timerecords.picture_id = _picture_id
  ORDER BY time_records.id ASC;
END//

CREATE PROCEDURE get_user_total_time_records_for_date(_user_id INTEGER, _date DATE) BEGIN
  SELECT SUM(seconds) / 60 as total_minutes FROM time_records
  JOIN picture_timerecords ON time_records.id = picture_timerecords.timerecord_id
  JOIN user_pictures ON picture_timerecords.picture_id = user_pictures.picture_id
  WHERE user_pictures.user_id = _user_id AND time_records.created_at >= _date AND time_records.created_at < _date + INTERVAL 1 DAY;
END//

DELIMITER ;