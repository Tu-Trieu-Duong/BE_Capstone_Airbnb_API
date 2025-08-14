/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userBookingId` int NOT NULL,
  `roomId` int NOT NULL,
  `checkinDate` datetime NOT NULL,
  `checkoutDate` datetime NOT NULL,
  `so_khach` int NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userBookingId` (`userBookingId`),
  KEY `room_booking_dates` (`roomId`,`checkinDate`,`checkoutDate`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userBookingId`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userCommentId` int NOT NULL,
  `roomId` int NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(255) DEFAULT NULL,
  `star_comment` int DEFAULT '5',
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userCommentId` (`userCommentId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userCommentId`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_location` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `room_images`;
CREATE TABLE `room_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_phong` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `so_khach` int NOT NULL,
  `phong_ngu` int NOT NULL,
  `giuong` int NOT NULL,
  `phong_tam` int NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `gia_tien` int NOT NULL,
  `may_giat` tinyint(1) DEFAULT NULL,
  `ban_la` tinyint(1) DEFAULT NULL,
  `tivi` tinyint(1) DEFAULT NULL,
  `dieu_hoa` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `bep` tinyint(1) DEFAULT NULL,
  `do_xe` tinyint(1) DEFAULT NULL,
  `ho_boi` tinyint(1) DEFAULT NULL,
  `ban_ui` tinyint(1) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `locationId` int NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `pass_word` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `birth_day` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT '1',
  `role` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `bookings` (`id`, `userBookingId`, `roomId`, `checkinDate`, `checkoutDate`, `so_khach`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-11-01 12:00:00', '2025-11-01 14:00:00', 3, 1, 0, 0, NULL, '2025-08-13 17:07:45', '2025-08-14 20:07:47'),
(2, 2, 2, '2025-01-01 12:00:00', '2025-01-01 14:00:00', 2, 1, 0, 0, NULL, '2025-08-13 17:18:39', '2025-08-14 00:26:14'),
(3, 2, 1, '2025-10-01 12:00:00', '2025-10-01 14:00:00', 2, 1, 0, 0, NULL, '2025-08-13 18:08:34', '2025-08-13 18:41:25'),
(4, 1, 3, '2025-11-01 12:00:00', '2025-11-01 15:00:00', 3, 1, 0, 0, NULL, '2025-08-13 18:16:36', '2025-08-13 18:41:06'),
(5, 3, 2, '2025-11-01 17:00:00', '2025-11-02 15:00:00', 3, 1, 0, 0, NULL, '2025-08-13 18:35:24', '2025-08-13 18:41:25'),
(6, 3, 1, '2025-11-03 17:00:00', '2025-11-04 17:00:00', 3, 1, 0, 0, NULL, '2025-08-13 18:36:00', '2025-08-14 00:26:14'),
(7, 1, 3, '2025-12-01 12:00:00', '2025-12-02 14:00:00', 4, 1, 0, 0, NULL, '2025-08-14 00:09:53', '2025-08-14 00:09:53'),
(8, 1, 1, '2025-10-01 15:00:00', '2025-10-02 14:00:00', 2, 1, 0, 0, NULL, '2025-08-14 00:28:36', '2025-08-14 00:28:36'),
(9, 3, 1, '2026-10-01 15:00:00', '2026-10-02 14:00:00', 2, 1, 0, 0, NULL, '2025-08-14 00:36:35', '2025-08-14 00:44:56'),
(10, 2, 1, '2026-10-01 15:00:00', '2026-10-02 14:00:00', 2, 1, 0, 0, NULL, '2025-08-14 00:45:01', '2025-08-14 00:45:14'),
(12, 1, 3, '2026-10-01 15:00:00', '2026-10-02 14:00:00', 2, 1, 0, 0, NULL, '2025-08-14 00:45:25', '2025-08-14 00:45:25'),
(13, 4, 1, '2025-10-01 12:00:00', '2025-10-02 14:00:00', 3, 1, 0, 0, NULL, '2025-08-14 10:46:45', '2025-08-14 10:46:45'),
(14, 4, 3, '2025-10-01 09:00:00', '2025-10-03 14:00:00', 3, 1, 4, 1, '2025-08-14 10:51:35', '2025-08-14 10:47:42', '2025-08-14 17:51:35'),
(15, 5, 2, '2025-10-01 09:00:00', '2025-10-03 14:00:00', 1, 1, 0, 0, NULL, '2025-08-14 10:48:27', '2025-08-14 17:48:38'),
(16, 2, 2, '2025-10-01 09:00:00', '2025-10-03 14:00:00', 1, 1, 0, 0, NULL, '2025-08-14 10:48:43', '2025-08-14 17:48:59'),
(17, 6, 1, '2025-11-01 12:00:00', '2025-11-01 14:00:00', 3, 1, 0, 0, NULL, '2025-08-14 13:05:54', '2025-08-14 20:12:53');
INSERT INTO `comments` (`id`, `userCommentId`, `roomId`, `date`, `comment`, `star_comment`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-08-14 08:25:24', 'Phòng rất sạch sẽ và tiện nghi!', 2, 1, 0, 0, NULL, '2025-08-14 15:25:24', '2025-08-14 16:36:16'),
(2, 2, 2, '2025-08-14 08:28:40', 'Phòng rất sạch sẽ và tiện nghi!', 4, 1, 0, 0, NULL, '2025-08-14 15:28:40', '2025-08-14 16:36:16'),
(3, 1, 3, '2025-08-14 08:48:30', 'Phòng rất sạch sẽ và tiện nghi!', 5, 1, 0, 0, NULL, '2025-08-14 08:48:30', '2025-08-14 08:48:30'),
(4, 2, 4, '2025-08-14 08:51:03', 'Phòng rất sạch sẽ và tiện nghi!', 5, 1, 0, 0, NULL, '2025-08-14 15:51:03', '2025-08-14 16:14:59'),
(5, 3, 5, '2025-08-14 08:53:49', 'Phòng rất sạch sẽ và tiện nghi!', 5, 1, 0, 0, NULL, '2025-08-14 08:53:49', '2025-08-14 16:14:59'),
(6, 1, 5, '2025-08-14 09:09:30', 'Phòng rất sạch sẽ và tiện nghi!', 5, 1, 0, 0, NULL, '2025-08-14 09:09:30', '2025-08-14 09:09:30'),
(7, 1, 1, '2025-08-14 09:34:41', 'Phòng rất sạch sẽ và tiện nghi!', 5, 1, 0, 0, NULL, '2025-08-14 09:34:41', '2025-08-14 09:34:41'),
(8, 4, 1, '2025-08-14 11:50:56', 'Phòng rất sạch sẽ và tiện nghi!', 4, 1, 0, 0, NULL, '2025-08-14 11:50:56', '2025-08-14 18:52:22'),
(9, 6, 1, '2025-08-14 13:13:01', 'Phòng rất sạch sẽ và tiện nghi!', 4, 1, 6, 1, NULL, '2025-08-14 13:13:01', '2025-08-14 20:14:31');
INSERT INTO `locations` (`id`, `name_location`, `province`, `country`, `picture`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Thu Duc City', 'Ho Chi Minh', 'Vietnam', 'local-1755007342687-859402339.JPG', 1, 0, 0, NULL, '2025-08-10 16:45:36', '2025-08-12 21:03:41'),
(2, 'Ha Noi City', 'Ha Noi', 'Vietnam', NULL, 1, 0, 0, NULL, '2025-08-10 16:47:56', '2025-08-10 17:15:48'),
(3, 'Da Nang City', 'Da Nang', 'Vietnam', 'local-1755176063544-438635112.JPG', 1, 0, 0, NULL, '2025-08-12 20:59:33', '2025-08-14 19:54:23'),
(4, 'District 1', 'Ho Chi Minh', 'Vietnam', NULL, 1, 6, 1, '2025-08-14 12:53:53', '2025-08-14 12:52:31', '2025-08-14 19:53:52');
INSERT INTO `room_images` (`id`, `room_id`, `image_url`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(3, 1, 'local-1755010334023-143354911.JPG', 1, 0, 0, NULL, '2025-08-12 21:52:14', '2025-08-12 21:52:14'),
(4, 1, 'local-1755010334096-188112779.JPG', 1, 0, 0, NULL, '2025-08-12 21:52:14', '2025-08-12 21:52:14'),
(5, 6, 'local-1755107778872-931826444.JPG', 1, 0, 0, NULL, '2025-08-14 00:56:19', '2025-08-14 00:56:19'),
(7, 7, 'local-1755176666326-405411593.JPG', 1, 0, 0, NULL, '2025-08-14 13:04:27', '2025-08-14 13:04:27'),
(8, 7, 'local-1755176666578-349181875.JPG', 1, 0, 0, NULL, '2025-08-14 13:04:27', '2025-08-14 13:04:27'),
(9, 7, 'local-1755176694289-647205544.JPG', 1, 0, 0, NULL, '2025-08-14 13:04:54', '2025-08-14 13:04:54');
INSERT INTO `rooms` (`id`, `ten_phong`, `so_khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `locationId`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`, `quantity`) VALUES
(1, 'Phòng Deluxe', 3, 2, 2, 1, 'Phòng rộng, có ban công...', 500000, 1, 0, 1, 1, 1, 1, 1, 1, 0, NULL, 1, 1, 0, 0, NULL, '2025-08-12 21:04:45', '2025-08-14 00:57:47', 3),
(2, 'Phòng Executive', 2, 1, 1, 1, 'Phòng thường, có ban công...', 300000, 0, 1, 1, 1, 1, 0, 1, 0, 0, NULL, 2, 1, 0, 0, NULL, '2025-08-12 21:05:30', '2025-08-14 00:27:33', 2),
(3, 'Phòng Luxury', 4, 2, 2, 2, 'Phòng rộng, có ban công...', 800000, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, 3, 1, 0, 0, NULL, '2025-08-12 21:07:58', '2025-08-12 21:07:58', 1),
(4, 'Phòng Deluxe 1', 4, 2, 2, 1, 'Phòng rộng, có ban công...', 500000, 1, 0, 1, 1, 1, 1, 1, 1, 0, NULL, 1, 1, 0, 0, NULL, '2025-08-12 22:48:55', '2025-08-12 22:55:49', 1),
(5, 'Phòng Triple', 6, 1, 3, 1, 'Phòng rộng, có ban công, phù hợp gia đình', 800000, 1, 1, 1, 1, 1, 1, 1, 1, 0, NULL, 1, 1, 0, 0, NULL, '2025-08-12 22:55:33', '2025-08-12 22:55:33', 1),
(6, 'Phòng Super Deluxe', 4, 3, 3, 2, 'Phòng rộng, có ban công...', 1000000, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, 3, 1, 0, 0, NULL, '2025-08-14 00:53:56', '2025-08-14 00:55:14', 3),
(7, 'Phòng test', 4, 2, 2, 1, 'Phòng rộng, có ban công...', 500000, 1, 0, 1, 1, 1, 1, 1, 1, 0, NULL, 3, 1, 0, 0, NULL, '2025-08-14 12:55:42', '2025-08-14 19:59:20', 1),
(8, 'Phòng Test Deluxe', 4, 2, 2, 1, 'Phòng rộng, có ban công...', 500000, 1, 0, 1, 1, 1, 1, 1, 1, 0, NULL, 3, 1, 6, 1, '2025-08-14 13:04:08', '2025-08-14 13:02:46', '2025-08-14 20:04:07', 1);
INSERT INTO `users` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`, `isActive`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Nguyen Van A', 'tutrieuduong@gmail.com', '$2b$10$7COOBadvd.DJ/xJaS7Urs.gKXWosZ2JgqaWKu1mk0DxQLtSpsr35O', '0123456789', '2000-01-01', 1, 'user', 'images/miwdapzxj4nfrgoe8poe', 1, 1, 1, '2025-08-14 13:54:28', '2025-07-26 22:35:01', '2025-08-14 20:55:35'),
(2, 'Từ Triệu Dương', 'tutrieuduong1@gmail.com', '$2b$10$ipeqMvl0FEX2KR.Qg2L0VuVydpg2myR9qae4k52ziXLpIEmAYLX76', '0123456789', '2000-01-01', 0, 'user', 'images/fsxfkna9txw5cikr3q2p', 1, 0, 0, NULL, '2025-08-05 18:03:35', '2025-08-07 17:30:27'),
(3, 'Nguyen Van B', 'tutrieuduong2@gmail.com', '$2b$10$PoumpBCm/JVaX0nDFOSKVew698lO964I9pz9ZaBW8Rt2lWBPsItP2', '0123456789', '2000-01-01', 1, 'user', NULL, 1, 0, 0, NULL, '2025-08-05 18:46:23', '2025-08-06 16:51:41'),
(4, 'Triệu Dương', 'tutrieuduong3@gmail.com', '$2b$10$z7WWbWWMtRgkLHGFIE9cuO4R4jFLaXqwM6/9bi1KvOrF51aVG3CCy', '0909090909', '1998-06-18', 1, 'user', 'local-1755168192226-426396105.JPG', 1, 0, 0, NULL, '2025-08-14 09:58:51', '2025-08-14 17:43:12'),
(5, 'Nguyen Van D', 'tutrieuduong4@gmail.com', '$2b$10$fLMnmjyv.bAJQWct7BSlBO0JNAciMYEfX6SbSQoBATaf8obfmCEz6', '0123123123', '2015-08-10', 0, 'user', NULL, 1, 0, 0, NULL, '2025-08-14 10:00:25', '2025-08-14 10:00:25'),
(6, 'Triệu Dương', 'test@gmail.com', '$2b$10$C2Tak8OynQHNTV8RAAvtJ.7O4d4.QfXfipRHqBdnG98ghyQYtB5Jy', '0123456789', '2000-10-15', 1, 'user', 'images/cbzutoftmbmpc3r9nrfn', 1, 0, 0, NULL, '2025-08-14 12:47:46', '2025-08-14 20:08:05'),
(7, 'Nguyen Van F', 'tutrieuduongtest@gmail.com', '$2b$10$TiqLiHZ.X3fg4MDdKspVn.Dv.fy6zSHCosF.1ilk/tE4v.5ayd6Sm', '0123456789', '2000-01-01', 1, 'user', NULL, 1, 0, 0, NULL, '2025-08-14 12:49:46', '2025-08-14 12:49:46'),
(8, 'Nguyen Van A', 'tutrieuduongtest1@gmail.com', '$2b$10$qpSnA5DbsG8Woi3qV/ZMYOi7jhFco32K0zNrceCxezRGEoEseFpoa', '0123456789', '2000-01-01', 1, 'user', NULL, 1, 0, 0, NULL, '2025-08-14 13:50:14', '2025-08-14 13:50:14'),
(9, 'Nguyen Van A', 'tutrieuduongtesst@gmail.com', '$2b$10$46vfjU.wJhLnR88xKh/fgu134FqjL/38H4bajycGA6zHusQaCc2Xq', '0123456789', '2000-01-01', 1, 'user', NULL, 1, 0, 0, NULL, '2025-08-14 13:56:34', '2025-08-14 13:56:34');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;