'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CaseTabs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_Colonne: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Colonnes',
          key: 'id'
        }
      },
      id_Ligne: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Lignes',
          key: 'id'
        }
      },
      estCoche: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CaseTabs');
  }
};