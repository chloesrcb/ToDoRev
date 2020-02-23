'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    mdp: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    anneeEtude: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    models.User.hasMany(models.Matiere)
  };
  return User;
};