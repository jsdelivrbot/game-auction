'use strict';

let DbError = require(global.getAppPath('errors')).Db;

module.exports = (sequelize, Sequelize) => {
  // MySQL 'auctions' model
  var Auctions = sequelize.define('auctions', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: Sequelize.INTEGER,
    player_id: Sequelize.INTEGER,
    inventory_id: Sequelize.INTEGER,
    qty: Sequelize.DECIMAL,
    min_price: Sequelize.DECIMAL,
    status: Sequelize.ENUM('pending', 'running', 'completed'),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  }, {
    timestamps: true,
    instanceMethods: {
      setRunning: function() {
        this.status = 'running';
        return this.save();
      },
      setCompleted: function() {
        return sequelize.query(`call auction_completed(${this.id});`, {
            raw: true,
            type: sequelize.QueryTypes.INSERT
          })
          .then(() => {
            this.status = 'completed';
            return this.save();
          })
          .catch((err) => {
            throw new DbError(err);
          });
      }
    },
    classMethods: {
      associate: (models) => {
        Auctions.hasMany(models['auctions_bids'], {
          foreignKey: 'auction_id'
        });

        Auctions.belongsTo(models['users'], {
          foreignKey: 'user_id'
        });
      }
    }
  });

  return Auctions;
};