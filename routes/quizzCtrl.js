var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addQuizz: function(req, res,idMatiere){
        //Params
        var libelle = req.body.libelle;
        
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Quizz.findOne({
            where: {libQuizz: libelle, id_Matiere:idMatiere }
        })
        .then(function(quizzFound){
            if(!quizzFound){
                var newQuizz = models.Quizz.create({
                    libQuizz: libelle,
                    id_Matiere:idMatiere,
                    MatiereId:id
                })
                .then(function(newQuizz){
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

    getQuizzs:function(req, res,idMatiere,callback){
        models.Quizz.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(quizzsFound){
            if(quizzsFound){
                callback( quizzsFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Quizzs'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}