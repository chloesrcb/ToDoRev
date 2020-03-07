var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var questionCtrl  = require('./questionCtrl');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

module.exports = {
    addQuizz: function(req, res,idMatiere){
        //Params
        var libelle = req.body.libelle;

        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        libelle=DOMPurify.sanitize(libelle);

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
                    MatiereId:idMatiere
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

    getQuizz:function(req, res,idMatiere,callback){
        console.log('on cherche un quizz');
        models.Quizz.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(quizzFound){
            if(quizzFound){
                callback( quizzFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Quizz'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },

    getQuizzID:function(req, res,idMatiere,libelle,callback){
        models.Quizz.findOne({
            where: {id_Matiere:idMatiere,
                    libQuizz:libelle }
        })
        .then(function(quizzFound){
            console.log(quizzFound)
            if(quizzFound){   
                console.log("La")
                callback( quizzFound.dataValues.id);
            }
            else{
                return res.status(409).json({ 'error': 'No Quizz'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'erreur recherche du quizz'});
        });
    },

    delAllQuizz:function(req,res,idMatiere,callback){
        models.Quizz.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(quizzFound){
            if(quizzFound){   
                for(var i=0;i<quizzFound.lentgh;i++){
                    questionCtrl.delQuestion(req,res,quizzFound[i].dataValues.id,function(){});
                }
                callback();
            }
            else{
                callback();
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'erreur recherche du quizz'});
        });
    }

}