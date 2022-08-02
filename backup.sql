-- MySQL dump 10.13  Distrib 8.0.28, for Linux (x86_64)
--
-- Host: localhost    Database: rapid_tracing
-- ------------------------------------------------------
-- Server version	8.0.28-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `picture_timerecords`
--

DROP TABLE IF EXISTS `picture_timerecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `picture_timerecords` (
  `picture_id` int NOT NULL,
  `timerecord_id` int NOT NULL,
  KEY `picture_id` (`picture_id`),
  KEY `timerecord_id` (`timerecord_id`),
  CONSTRAINT `picture_timerecords_ibfk_1` FOREIGN KEY (`picture_id`) REFERENCES `pictures` (`id`),
  CONSTRAINT `picture_timerecords_ibfk_2` FOREIGN KEY (`timerecord_id`) REFERENCES `time_records` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `picture_timerecords`
--

LOCK TABLES `picture_timerecords` WRITE;
/*!40000 ALTER TABLE `picture_timerecords` DISABLE KEYS */;
INSERT INTO `picture_timerecords` VALUES (1,1),(1,2),(1,4),(3,5),(4,6),(5,7),(9,9),(11,10),(12,11),(13,12),(14,13),(15,14),(16,15),(17,16),(18,17),(19,18),(20,19),(21,20),(22,21),(23,22),(24,23),(25,24),(14,25),(1,26),(18,27),(22,28),(16,29),(14,30),(18,31),(11,32),(1,33),(15,34),(3,35),(18,36),(26,37),(19,38),(27,39),(28,40),(29,41),(30,42),(31,43);
/*!40000 ALTER TABLE `picture_timerecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pictures`
--

DROP TABLE IF EXISTS `pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` text NOT NULL,
  `extension` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pictures`
--

LOCK TABLES `pictures` WRITE;
/*!40000 ALTER TABLE `pictures` DISABLE KEYS */;
INSERT INTO `pictures` VALUES (1,'x2t9q5','jpg','2022-02-19 22:56:47'),(3,'b0si4','jpg','2022-02-19 23:15:21'),(4,'eo989','jpg','2022-02-19 23:24:08'),(5,'ezxgor','jpg','2022-02-19 23:32:08'),(9,'tv6bqox','png','2022-02-20 03:10:57'),(11,'v0eayb','jpg','2022-02-20 03:48:56'),(12,'4jsikp','jpg','2022-02-20 04:22:41'),(13,'5ps91','jpg','2022-02-20 04:31:38'),(14,'b5dckl','jpg','2022-02-20 04:36:31'),(15,'0f5myk','jpg','2022-02-20 04:41:29'),(16,'3neuu8','jpg','2022-02-20 04:49:17'),(17,'rmktxo','jpg','2022-02-20 04:57:42'),(18,'p0xou','jpeg','2022-02-20 05:07:14'),(19,'nr3e96k','jpeg','2022-02-20 05:12:25'),(20,'iacosqi','jpeg','2022-02-20 05:18:54'),(21,'4teyc','jpeg','2022-02-20 05:24:54'),(22,'g4pik','jpeg','2022-02-20 05:32:37'),(23,'rwzjz','jpeg','2022-02-20 05:39:08'),(24,'7h4mkp','jpeg','2022-02-20 05:42:59'),(25,'6379v','jpg','2022-02-20 05:56:37'),(26,'nn9ys','jpg','2022-02-20 11:04:06'),(27,'m5yw15','png','2022-02-20 11:14:21'),(28,'oo0z6m','png','2022-02-20 11:19:37'),(29,'h1e25','png','2022-02-20 11:29:39'),(30,'1gbkb9','jpg','2022-02-20 11:33:23'),(31,'gzejud','jpg','2022-02-20 11:39:58');
/*!40000 ALTER TABLE `pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_records`
--

DROP TABLE IF EXISTS `time_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seconds` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_records`
--

LOCK TABLES `time_records` WRITE;
/*!40000 ALTER TABLE `time_records` DISABLE KEYS */;
INSERT INTO `time_records` VALUES (1,267,'2022-02-19 23:01:34'),(2,220,'2022-02-19 23:05:22'),(3,314,'2022-02-19 23:11:56'),(4,166,'2022-02-19 23:14:45'),(5,281,'2022-02-19 23:23:31'),(6,410,'2022-02-19 23:31:51'),(7,319,'2022-02-19 23:38:11'),(8,204,'2022-02-19 23:41:37'),(9,364,'2022-02-20 03:46:59'),(10,289,'2022-02-20 03:53:50'),(11,362,'2022-02-20 04:28:49'),(12,278,'2022-02-20 04:36:19'),(13,263,'2022-02-20 04:40:58'),(14,444,'2022-02-20 04:48:57'),(15,477,'2022-02-20 04:57:18'),(16,369,'2022-02-20 05:04:03'),(17,198,'2022-02-20 05:11:03'),(18,161,'2022-02-20 05:15:09'),(19,221,'2022-02-20 05:23:02'),(20,369,'2022-02-20 05:31:22'),(21,193,'2022-02-20 05:35:54'),(22,125,'2022-02-20 05:41:56'),(23,167,'2022-02-20 05:45:49'),(24,578,'2022-02-20 06:06:23'),(25,256,'2022-02-20 06:10:42'),(26,188,'2022-02-20 06:18:37'),(27,97,'2022-02-20 06:20:24'),(28,135,'2022-02-20 10:08:20'),(29,252,'2022-02-20 10:12:36'),(30,264,'2022-02-20 10:17:13'),(31,133,'2022-02-20 10:19:29'),(32,106,'2022-02-20 10:21:18'),(33,193,'2022-02-20 10:55:33'),(34,241,'2022-02-20 10:59:38'),(35,117,'2022-02-20 11:01:37'),(36,75,'2022-02-20 11:02:54'),(37,297,'2022-02-20 11:10:03'),(38,117,'2022-02-20 11:12:44'),(39,158,'2022-02-20 11:17:03'),(40,68,'2022-02-20 11:20:56'),(41,88,'2022-02-20 11:31:10'),(42,365,'2022-02-20 11:39:41'),(43,405,'2022-02-20 11:49:42');
/*!40000 ALTER TABLE `time_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_pictures`
--

DROP TABLE IF EXISTS `user_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_pictures` (
  `user_id` int NOT NULL,
  `picture_id` int NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `picture_id` (`picture_id`),
  CONSTRAINT `user_pictures_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_pictures_ibfk_2` FOREIGN KEY (`picture_id`) REFERENCES `pictures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_pictures`
--

LOCK TABLES `user_pictures` WRITE;
/*!40000 ALTER TABLE `user_pictures` DISABLE KEYS */;
INSERT INTO `user_pictures` VALUES (1,1),(1,3),(1,4),(1,5),(1,9),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31);
/*!40000 ALTER TABLE `user_pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'lincoln','$2b$10$yTZH0n5aIG4CNHTun8lFCOwj5uvGLb8Is7baTKGhuT.Hh//w3B09e','2022-02-19 22:52:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-20 12:53:26
