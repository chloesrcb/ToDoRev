var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var colonneCtrl = require('./colonneCtrl');
var caseCtrl = require('./caseCtrl');

module.exports = {
    addLigne: function(req, res,idMatiere,numLigne){
        //Params
        var libelle = req.body.libelle;
        
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Ligne.findOne({
            where: {libLigne: libelle,
                numLigne:numLigne,
                id_Matiere:idMatiere }
        })
        .then(function(ligneFound){
            if(!ligneFound){
                var newLigne = models.Ligne.create({
                    libLigne: libelle,
                    numLigne:numLigne,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newLigne){
                    var idLigne=newLigne.id;
                    colonneCtrl.getColonnes(req,res,matiereId,function(colonneList){
                        for(var i=0;i<colonneList.length;i++){
                            caseCtrl.addCase(req,res,idLigne,colonneList[i].dataValues.id);
                        }

                        res.status(200)
                        return res.redirect("/home");
                    });
                })
                .catch(function(err){
                    return res.status(500).json({'error':err});
                });
            }else{
                return res.status(409).json({ 'error': 'Ligne already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': err});
        });
    },

    getLignes:function(req, res,idMatiere,callback){
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
            return res.status(500).json({ 'error': err});
        });
    }

}