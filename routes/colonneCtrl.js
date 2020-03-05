var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var ligneCtrl = require('./ligneCtrl');
var caseCtrl = require('./caseCtrl');

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
    }

}