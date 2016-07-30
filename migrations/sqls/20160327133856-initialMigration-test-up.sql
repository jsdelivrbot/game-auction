USE `auctiontest`;

DROP TABLE IF EXISTS `auctions`;
CREATE TABLE `auctions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `min_price` decimal(12,2) NOT NULL,
  `qty` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `auctions_bids`;
CREATE TABLE `auctions_bids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auction_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `coins` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `inventory_type_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`id`,`user_id`,`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `inventory_types`;
CREATE TABLE `inventory_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `img` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

LOCK TABLES `inventory_types` WRITE;
INSERT INTO `inventory_types` VALUES (1,'Breads','breads'),(2,'Carrots','carrots'),(3,'Diamonds','diamonds');
UNLOCK TABLES;

DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `coins` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

USE `auctiontest`;
DROP procedure IF EXISTS `auction_completed`;

USE `auctiontest`;
CREATE  PROCEDURE `auction_completed`(IN auction_id INT)
BEGIN
	START TRANSACTION;
		SELECT @qty:=qty, @player_id:=player_id, @inventory_id:=inventory_id FROM `auctions`  WHERE `auctions`.`id` = auction_id LIMIT 1;
		SELECT @coins:=coins, @buyer_id:=player_id FROM `auctions_bids`  WHERE `auctions_bids`.`auction_id` = auction_id ORDER BY `auctions_bids`.`coins` DESC LIMIT 1;
        SELECT @seller_qty:=qty, @inventory_type_id:=inventory_type_id FROM `inventory`  WHERE `inventory`.`id` = @inventory_id LIMIT 1;
        SELECT @buyer_coins:=coins FROM `players` WHERE `players`.`id`=@buyer_id;

		IF (@coins IS NOT NULL AND @coins > 0 AND @qty > 0 AND @buyer_coins >= @coins AND @seller_qty >= @qty) THEN
			UPDATE `inventory` SET `inventory`.`qty`= `inventory`.`qty` - @qty WHERE `inventory`.`id`=@inventory_id;
			UPDATE `players` SET `players`.`coins`= `players`.`coins` + @coins WHERE `players`.`id`=@player_id;
			UPDATE `inventory` SET `inventory`.`qty`= `inventory`.`qty` + @qty WHERE `inventory`.`inventory_type_id`=@inventory_type_id
				AND `inventory`.`player_id`=@buyer_id;
			UPDATE `players` SET `players`.`coins`= `players`.`coins` - @coins WHERE `players`.`id`=@buyer_id;
        END IF;
	COMMIT;
END
;

USE `auctiontest`;
DROP procedure IF EXISTS `create_inventory`;

USE `auctiontest`;
CREATE PROCEDURE `create_inventory` (IN player_id INT, IN user_id INT)
BEGIN
	INSERT INTO `inventory` (`player_id`, `user_id`, `inventory_type_id`, `qty`)
		VALUES
			(player_id,user_id,1,30),
			(player_id,user_id,2,18),
			(player_id,user_id,3,1);
END
;

USE `auctiontest`;
DROP procedure IF EXISTS `create_player`;

USE `auctiontest`;
CREATE PROCEDURE `create_player`(IN user_id INT)
BEGIN
	INSERT INTO `players` (`user_id`, `coins`) VALUES(user_id, 1000);
    SELECT * FROM `players` WHERE `players`.`user_id` = user_id LIMIT 1;
END
;