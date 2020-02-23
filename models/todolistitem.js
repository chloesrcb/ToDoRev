'use strict';
module.exports = (sequelize, DataTypes) => {
  const todolistitem = sequelize.define('todolistitem', {
    contenu: DataTypes.STRING,
    id_Matiere: DataTypes.INTEGER,
    done: DataTypes.BOOLEAN
  }, {});
  todolistitem.associate = function(models) {
    // associations can be defined here
    models.todolistitem.belongsTo(models.Matiere, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return todolistitem;
};