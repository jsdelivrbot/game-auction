'use strict';

module.exports = (sequelize, Sequelize) => {
  // MySQL 'auctions_bids' model
  var AuctionsBids = sequelize.define('auctions_bids', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    auction_id: Sequelize.INTEGER,
    player_id: Sequelize.INTEGER,
    coins: Sequelize.DECIMAL
  }, {
    timestamps: false
  });

  return AuctionsBids;
};