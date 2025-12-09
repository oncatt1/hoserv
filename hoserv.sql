-- phpMyAdmin SQL Dump
-- version 5.2.2deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 09, 2025 at 07:59 PM
-- Server version: 8.4.7-0ubuntu0.25.10.3
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hoserv`
--

-- --------------------------------------------------------

--
-- Table structure for table `db_photos`
--

CREATE TABLE `db_photos` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `db_photos`
--

INSERT INTO `db_photos` (`id`, `name`) VALUES
(1, 'photos_general'),
(2, 'photos_cezary'),
(3, 'photos_dorota'),
(4, 'photos_patrycja'),
(5, 'photos_wojtek');

-- --------------------------------------------------------

--
-- Table structure for table `photos_cezary`
--

CREATE TABLE `photos_cezary` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos_dorota`
--

CREATE TABLE `photos_dorota` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos_general`
--

CREATE TABLE `photos_general` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos_general`
--

INSERT INTO `photos_general` (`id`, `name`, `date`, `user_id`, `folder`, `size`) VALUES
(1, '1763068279448-Screenshot_20251113_213436.png', '2025-11-13 19:34:38', 1, 'ddd', 84229),
(2, '1763068291050-Trollface.png', '2025-11-06 17:41:41', 2, 'ddddd', 15180000),
(3, '1764008065091-Tapestry_of_blazing_starbirth.jpg', '2025-08-22 17:04:38', 3, 'wojtek', 3624977),
(4, '', '2025-11-30 18:55:21', 3, 'dupa', 0),
(5, '1764532560967-2017-12-29_17.51.25.png', '2017-12-29 15:51:26', 3, 'dupa', 143686),
(6, '1764613327601-2018-01-19_16.52.06.png', '2018-01-19 14:52:08', 2, 'dupa', 259737),
(7, '1764613344022-2018-01-19_16.52.06.png', '2018-01-19 14:52:08', 2, 'dupa', 259737),
(8, '1764614362797-2018-01-19_16.52.06.png', '2018-01-19 14:52:08', 2, 'dupa', 259737),
(9, '1764757305189-2018-01-02_18.31.51.png', '2018-01-02 16:31:52', 1, 'dupa', 741936),
(10, '1764872661940-Tapestry_of_blazing_starbirth.jpg', '2025-08-22 17:04:38', 5, 'dddd', 3624977),
(11, '1765310278746-20230607175228_1.jpg', '2023-06-07 13:52:30', 1, 'ddddd', 278584);

-- --------------------------------------------------------

--
-- Table structure for table `photos_patrycja`
--

CREATE TABLE `photos_patrycja` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos_wojtek`
--

CREATE TABLE `photos_wojtek` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos_wojtek`
--

INSERT INTO `photos_wojtek` (`id`, `name`, `date`, `user_id`, `folder`, `size`) VALUES
(1, '1764965260284-20230407162059_1.jpg', '2023-04-07 12:21:00', 5, 'ddd', 340482),
(2, '', '2025-12-05 19:21:38', 5, '5', 0),
(3, '1764966183484-20230212141314_1.jpg', '2023-02-12 12:13:16', 5, 'dddddd', 324386);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `login` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `db_main` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `db_main`) VALUES
(1, 'admin', 'admin', 1),
(2, 'wojtek', 'wojtek', 5),
(3, 'cezary', 'cezary', 2),
(4, 'dorota', 'dorota', 3),
(5, 'patrycja', 'patrycja', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `db_photos`
--
ALTER TABLE `db_photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos_cezary`
--
ALTER TABLE `photos_cezary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos_dorota`
--
ALTER TABLE `photos_dorota`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos_general`
--
ALTER TABLE `photos_general`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos_patrycja`
--
ALTER TABLE `photos_patrycja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos_wojtek`
--
ALTER TABLE `photos_wojtek`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `db_photos`
--
ALTER TABLE `db_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `photos_cezary`
--
ALTER TABLE `photos_cezary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos_dorota`
--
ALTER TABLE `photos_dorota`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos_general`
--
ALTER TABLE `photos_general`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `photos_patrycja`
--
ALTER TABLE `photos_patrycja`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos_wojtek`
--
ALTER TABLE `photos_wojtek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
