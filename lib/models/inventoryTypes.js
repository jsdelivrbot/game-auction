'use strict';

module.exports = (sequelize, Sequelize) => {
  // MySQL 'inventory_types' model
  var InventoryTypes = sequelize.define('inventory_types', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    img: Sequelize.STRING
  }, {
    timestamps: false
  });

  return InventoryTypes;
};