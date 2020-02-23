'use strict';
module.exports = (sequelize, DataTypes) => {
  const Quizz = sequelize.define('Quizz', {
    libQuizz: DataTypes.STRING,
    id_Matiere: DataTypes.INTEGER
  }, {});
  Quizz.associate = function(models) {
    // associations can be defined here
    models.Quizz.hasMany(models.Question)
    models.Quizz.belongsTo(models.Matiere, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Quizz;
};