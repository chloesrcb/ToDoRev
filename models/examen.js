'use strict';
module.exports = (sequelize, DataTypes) => {
  const Examen = sequelize.define('Examen', {
    libExamen: DataTypes.STRING,
    dateExam: DataTypes.DATE,
    id_Matiere: DataTypes.INTEGER
  }, {});
  Examen.associate = function(models) {
    // associations can be defined here
    models.Examen.belongsTo(models.Matiere, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Examen;
};