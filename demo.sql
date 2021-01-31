/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : demo

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 31/01/2021 11:01:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tab1
-- ----------------------------
DROP TABLE IF EXISTS `tab1`;
CREATE TABLE `tab1` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tab1
-- ----------------------------
BEGIN;
INSERT INTO `tab1` VALUES ('rrr', 123);
INSERT INTO `tab1` VALUES ('rrr11', 1231);
INSERT INTO `tab1` VALUES ('ycc', 12);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
