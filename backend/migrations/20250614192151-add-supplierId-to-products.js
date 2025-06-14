'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'supplierId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Suppliers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'supplierId');
  }
};