var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
var matiereCtrl = require('./matiereCtrl');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = {
    addExam: function(req, res,idMatiere){
        //Params
        var libelle = req.body.libelle;
        var date = req.body.date;
        
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        libelle=DOMPurify.sanitize(libelle);
        
        if(libelle==undefined || date==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Examen.findOne({
            where: {libExamen: libelle,
                dateExam:date,
                id_Matiere:idMatiere }
        })
        .then(function(examFound){
            console.log("Il y a un res")
            if(!examFound){
                console.log("On tente de creer")
                var newExam = models.Examen.create({
                    libExamen: libelle,
                    dateExam: date,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newExam){
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

    getExams:function(req, res,idMatiere,callback){
        models.Examen.findAll({
            where: {id_Matiere:idMatiere}
        })
        .then(function(examsFound){
            if(examsFound){
                callback(examsFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Exam'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },

    delExam:function(req,res,matiereId,idItem,callback){
        models.Examen.destroy({
            where: {id:idItem, id_Matiere:matiereId}
        })
        .then(function(itemFound){
            if(itemFound){
                callback();
            }
            else{
                return res.status(409).json({ 'error': 'No Items'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'No Items'});
        });
    },


    getExamWithinTwoWeeks:function(req,res,idMatiere,matiereName,callback){
        models.Examen.findAll({
            where: {
                id_Matiere:idMatiere,
                dateExam: {
                    [Op.gt]: new Date(),
                    [Op.lt]: new Date(new Date().valueOf() + 14 * 24 * 60 * 60 * 1000)
                }
            }
              
        }).then(function(examsFound)
        {
            if(examsFound){
                callback(examsFound,matiereName);
            }
            else{
                callback(undefined,matiereName)
            }
        }).catch(function(error){
            console.log(error)
            return res.status(500).json({ 'error': error});
        })
    },

    delAllExam:function(req,res,idMatiere,callback){
        models.Examen.destroy({
            where: {id_Matiere:idMatiere}
        })
        .then(function(itemFound){
            if(itemFound){
                callback();
            }
            else{
                callback();
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'No Items'});
        });
    }

}