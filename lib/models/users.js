'use strict';

let DbError = require(global.getAppPath('errors')).Db;

module.exports = (sequelize, Sequelize) => {
  // MySQL 'users' model
  var Users = sequelize.define('users', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    username: Sequelize.STRING
  }, {
    timestamps: false,
    hooks: {
      afterCreate: (model) => {
        return createPlayer(model)
          .spread(createInventory);
      }
    }
  });

  function createPlayer(user) {
    return sequelize.query(`call create_player(${user.id});`, {
        raw: true,
        type: sequelize.QueryTypes.INSERT
      })
      .catch((err) => {
        throw new DbError(err);
      });
  }

  function createInventory(player) {
    if (!player) {
      throw new DbError('Not found!');
    }

    sequelize.query(`call create_inventory(${player.id}, ${player.user_id});`)
      .catch((err) => {
        throw new DbError(err);
      });
  }

  return Users;
};