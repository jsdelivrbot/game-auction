'use strict';

module.exports = (sequelize, Sequelize) => {
  // MySQL 'inventory' model
  var Inventory = sequelize.define('inventory', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: Sequelize.INTEGER,
    player_id: Sequelize.INTEGER,
    inventory_type_id: Sequelize.INTEGER,
    qty: Sequelize.DECIMAL
  }, {
    timestamps: false,
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        Inventory.belongsTo(models['inventory_types'], {
          foreignKey: 'inventory_type_id',
          targetKey: 'id'
        });
      }
    }
  });

  return Inventory;
};