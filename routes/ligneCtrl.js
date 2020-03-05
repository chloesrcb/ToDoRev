var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var colonneCtrl = require('./colonneCtrl');
var caseCtrl = require('./caseCtrl');

module.exports = {
    
    getLignes: function(req, res,idMatiere,callback){
        console.log("Je suis appelé");
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
    }

}