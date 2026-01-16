-- phpMyAdmin SQL Dump
-- version 5.2.2deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 16, 2026 at 07:20 PM
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
-- Table structure for table `db_folders`
--

CREATE TABLE `db_folders` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `userId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `db_folders`
--

INSERT INTO `db_folders` (`id`, `name`, `userId`) VALUES
(1, 'ddd', 5),
(2, 'ddd', 1),
(3, 'dupa', 5),
(4, 'ddd', 3);

-- --------------------------------------------------------

--
-- Table structure for table `db_photos`
--

CREATE TABLE `db_photos` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` int NOT NULL,
  `size` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos_dorota`
--

CREATE TABLE `photos_dorota` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` int NOT NULL,
  `size` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos_dorota`
--

INSERT INTO `photos_dorota` (`id`, `name`, `date`, `user_id`, `folder`, `size`, `type`) VALUES
(1, '1767282076380-1764757305189-2018-01-02_18.31.51.png', '2025-12-04 18:15:12', 3, 4, 741936, 'image/png');

-- --------------------------------------------------------

--
-- Table structure for table `photos_general`
--

CREATE TABLE `photos_general` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` int NOT NULL,
  `size` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos_general`
--

INSERT INTO `photos_general` (`id`, `name`, `date`, `user_id`, `folder`, `size`, `type`) VALUES
(5, '1767280687801-twitter_1993077168851865821.gif', '2025-12-03 12:57:29', 1, 2, 658000, 'image/gif'),
(6, '1767280896232-baSQMCxPkTz9sk6N.mp4', '2025-12-05 17:19:24', 1, 2, 4626744, 'video/mp4'),
(7, '1767281443097-1764757305189-2018-01-02_18.31.51.png', '2025-12-04 18:15:12', 1, 2, 741936, 'image/png'),
(8, '1768163708557-1766865680239-BuffPolishTF2Mercs-SHADXWBXRN-SHOTGUNEdit.mp4', '2025-12-28 10:57:52', 1, 2, 2918561, 'video/mp4');

-- --------------------------------------------------------

--
-- Table structure for table `photos_patrycja`
--

CREATE TABLE `photos_patrycja` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` int NOT NULL,
  `size` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos_wojtek`
--

CREATE TABLE `photos_wojtek` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `folder` int NOT NULL,
  `size` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos_wojtek`
--

INSERT INTO `photos_wojtek` (`id`, `name`, `date`, `user_id`, `folder`, `size`, `type`) VALUES
(1, '1767280660383-1764757305189-2018-01-02_18.31.51.png', '2025-12-04 18:15:12', 5, 1, 741936, 'image/png');

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
(2, 'wojtek', '$2b$10$PK3g4CajJeZ9zLR7Gh82Hu.4JI2/ol8s4/ny52KQBADRqwsQuxNW6', 5),
(3, 'cezary', 'cezary', 2),
(4, 'dorota', 'dorota', 3),
(5, 'patrycja', 'patrycja', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `db_folders`
--
ALTER TABLE `db_folders`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `db_folders`
--
ALTER TABLE `db_folders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `photos_general`
--
ALTER TABLE `photos_general`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `photos_patrycja`
--
ALTER TABLE `photos_patrycja`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos_wojtek`
--
ALTER TABLE `photos_wojtek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
