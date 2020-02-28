var bcrypt  = require('bcrypt');
var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addMat: function(req, res,id){
        //Params
        var libelle = req.body.libelle;
        
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Matiere.findOne({
            where: {libelle_Matiere: libelle, id_User:id }
        })
        .then(function(matiereFound){
            if(!matiereFound){
                var newMatiere = models.Matiere.create({
                    libelle_Matiere: libelle,
                    id_User:id,
                    UserId:id
                })
                .then(function(newMatiere){
                    res.status(200)
                    return res.redirect("/home");
                })
                .catch(function(err){
                    return res.status(500).json({'error':err});
                });
            }else{
                return res.status(409).json({ 'error': 'Matiere already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': err});
        });
    },
    getMatieres:function(req, res,id,callback){
        models.Matiere.findAll({
            where: {id_User:id}
        })
        .then(function(matieresFound){
            if(matieresFound){
                callback( matieresFound);
            }
            else{
                return res.status(409).json({ 'error': 'No matieres'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}