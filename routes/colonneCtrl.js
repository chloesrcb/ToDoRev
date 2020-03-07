var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    getColonnes:function(req, res,idMatiere,callback){
        models.Colonne.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(colonnesFound){
            if(colonnesFound){
                callback(colonnesFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Colonnes'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },
    getColonneFromId:function(req, res,id,callback){
        console.log(id)
        models.Colonne.findOne({
            where: {id:id}
        })
        .then(function(colonneFound){
            console.log(colonneFound)
            if(colonneFound){
                callback(colonneFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Colonnes'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}