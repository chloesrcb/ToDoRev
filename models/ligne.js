'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ligne = sequelize.define('Ligne', {
    libLigne: DataTypes.STRING,
    id_Matiere: DataTypes.INTEGER
  }, {});
  Ligne.associate = function(models) {
    // associations can be defined here
    models.Ligne.belongsTo(models.Matiere, {
      foreignKey: {
        allowNull: false
      }
    })
    models.Ligne.hasMany(models.CaseTab)
  };
  return Ligne;
};