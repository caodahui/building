/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : webgdsystem

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2018-06-15 18:47:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `tb_sysuser`
-- ----------------------------
DROP TABLE IF EXISTS `tb_sysuser`;
CREATE TABLE `tb_sysuser` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `SysUserGuid` varchar(128) NOT NULL,
  `SysUserName` varchar(128) DEFAULT NULL,
  `SysUserPwd` varchar(128) DEFAULT NULL,
  `SysUserPower` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SysUserGuid` (`SysUserGuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_sysuser
-- ----------------------------
INSERT INTO `tb_sysuser` VALUES ('1', '123456', 'admin', '123456', null);
