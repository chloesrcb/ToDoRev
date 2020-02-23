'use strict';
module.exports = (sequelize, DataTypes) => {
  const Matiere = sequelize.define('Matiere', {
    libelle_Matiere: DataTypes.STRING,
    id_User: DataTypes.INTEGER
  }, {});
  Matiere.associate = function(models) {
    // associations can be defined here
    models.Matiere.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
    
    models.Matiere.hasMany(models.Examen)
    models.Matiere.hasMany(models.todolistitem)
    models.Matiere.hasMany(models.Colonne)
    models.Matiere.hasMany(models.Ligne)
    models.Matiere.hasMany(models.Quizz)
  };
  return Matiere;
};