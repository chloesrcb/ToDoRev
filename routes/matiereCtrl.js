var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var todolistCtrl  = require('./todolistCtrl');
var revisionCtrl  = require('./revisionCtrl');
var examenCtrl  = require('./examCtrl');
var quizzCtrl  = require('./quizzCtrl');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

module.exports = {
    addMat: function(req, res,id){
        //Params
        var libelle = req.body.libelle;
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        
        libelle=DOMPurify.sanitize(libelle);
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
    getMatieres:function(req, res,idUser,callback){
        models.Matiere.findAll({
            where: {id_User:idUser}
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
    },

    delMatiere:function(req,res,nameMatiere,idUser,callback){
        models.Matiere.findOne({
            where: {id_User:idUser, libelle_Matiere:nameMatiere}
        })
        .then(function(matiereFound){
            if(matiereFound){
                var idMatiere=matiereFound.dataValues.id;
                examenCtrl.delAllExam(req,res,idMatiere,function(){});
                todolistCtrl.delAllItem(req,res,idMatiere,function(){});
                quizzCtrl.delAllQuizz(req,res,idMatiere,function(){});
                revisionCtrl.delAllRevision(res,res,idMatiere);
               /* models.Matiere.destroy({
                    where: {id_Matiere:idMatiere}
                })
                .then(function(matiereSupp){
                    callback();
                })
                .catch(function(err){
                    callback();
                });*/
            }
            else{
                callback();
            }
        })
        .catch(function(err){
            callback()
        });
    },

    getMatiereFromId:function(req,res,id,callback){
        console.log("On est call")
        models.Matiere.findOne({
            where: {id:id}
        })
        .then(function(matiereFound){
            if(matiereFound){
                callback(matiereFound);
            }
            else{
                callback(undefined);
            }
        })
        .catch(function(err){
            callback(undefined)
        });
    },

    getMatiereId:function(nameMatiere,idUser,callback){
        models.Matiere.findOne({
            where: {id_User:idUser, libelle_Matiere:nameMatiere}
        })
        .then(function(matiereFound){
            if(matiereFound){
                callback(matiereFound.dataValues.id);
            }
            else{
                callback(undefined);
            }
        })
        .catch(function(err){
            callback(undefined)
        });
    }

}