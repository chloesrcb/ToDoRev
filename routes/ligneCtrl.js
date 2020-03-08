var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    
    getLignes: function(req, res,idMatiere,callback){
        models.Ligne.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(lignesFound){
            if(lignesFound){
                callback(lignesFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Lignes'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'probleme trouve ligne'});
        });
    },
    
    getLigneFromId:function(req, res,id,callback){
        models.Ligne.findOne({
            where: {id:id}
        })
        .then(function(ligneFound){
            if(ligneFound){
                callback(ligneFound);
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