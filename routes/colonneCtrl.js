var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var ligneCtrl = require('./ligneCtrl');
var caseCtrl = require('./caseCtrl');

module.exports = {
    addColonne: function(req, res,idMatiere,numColonne){
        //Params
        var libelle = req.body.libelle;
        
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Colonne.findOne({
            where: {LibColonne: libelle,
                numColonne:numColonne,
                id_Matiere:idMatiere }
        })
        .then(function(colonneFound){
            if(!colonneFound){
                var newColonne = models.Colonne.create({
                    LibColonne: libelle,
                    numColonne:numColonne,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newColonne){
                    var idColonne=newColonne.id;
                    ligneCtrl.getLignes(req,res,matiereId,function(ligneList){
                        for(var i=0;i<ligneList.length;i++){
                            caseCtrl.addCase(req,res,ligneList[i].dataValues.id,idColonne);
                        }

                        res.status(200)
                        return res.redirect("/home");
                    });
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