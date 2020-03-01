var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addColonne: function(req, res,idMatiere,numColonne){
        //Params
        var libelle = req.body.libelle;
        
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Colonne.findOne({
            where: {libColonne: libelle,
                numColonne:numColonne,
                id_Matiere:idMatiere }
        })
        .then(function(colonneFound){
            if(!colonneFound){
                var newColonne = models.Colonne.create({
                    libColonne: libelle,
                    numColonne:numColonne,
                    id_Matiere:idMatiere,
                    MatiereId:id
                })
                .then(function(newColonne){
                    res.status(200)
                    return res.redirect("/home");
                })
                .catch(function(err){
                    return res.status(500).json({'error':err});
                });
            }else{
                return res.status(409).json({ 'error': 'Colonne already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': err});
        });
    },

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