'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    Question: DataTypes.STRING,
    Reponse: DataTypes.STRING,
    id_Quizz: DataTypes.INTEGER
  }, {});
  Question.associate = function(models) {
    // associations can be defined here
    models.Question.belongsTo(models.Quizz, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Question;
};