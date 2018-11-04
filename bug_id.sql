CREATE TABLE `bugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'bug优先级',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creator` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fix_user` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='bug id generator';