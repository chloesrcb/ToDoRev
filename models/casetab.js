'use strict';
module.exports = (sequelize, DataTypes) => {
  const CaseTab = sequelize.define('CaseTab', {
    id_Colonne: DataTypes.INTEGER,
    id_Ligne: DataTypes.INTEGER,
    estCoche: DataTypes.BOOLEAN
  }, {});
  CaseTab.associate = function(models) {
    // associations can be defined here
    models.CaseTab.belongsTo(models.Colonne, {
      foreignKey: {
        allowNull: false
      }
    })
    models.CaseTab.belongsTo(models.Ligne, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return CaseTab;
};