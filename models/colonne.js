'use strict';
module.exports = (sequelize, DataTypes) => {
  const Colonne = sequelize.define('Colonne', {
    LibColonne: DataTypes.STRING,
    id_Matiere: DataTypes.INTEGER
  }, {});
  Colonne.associate = function(models) {
    // associations can be defined here
    models.Colonne.belongsTo(models.Matiere, {
      foreignKey: {
        allowNull: false
      }
    })
    models.Colonne.hasMany(models.CaseTab)
  };
  return Colonne;
};