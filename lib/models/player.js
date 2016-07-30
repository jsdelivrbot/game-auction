'use strict';

module.exports = (sequelize, Sequelize) => {
  // MySQL 'players' model
  var Players = sequelize.define('players', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: Sequelize.INTEGER,
    coins: Sequelize.DECIMAL
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        Players.belongsTo(models['users'], {
          foreignKey: 'user_id'
        });
      }
    }
  });

  return Players;
};