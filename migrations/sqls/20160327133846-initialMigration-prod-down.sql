USE `auction`;

DROP TABLE IF EXISTS `auctions`;
DROP TABLE IF EXISTS `auctions_bids`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `inventory_types`;
DROP TABLE IF EXISTS `players`;
DROP TABLE IF EXISTS `users`;

DROP procedure IF EXISTS `create_inventory`;
DROP procedure IF EXISTS `auction_completed`;
DROP procedure IF EXISTS `create_player`;