var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addExam: function(req, res,idMatiere){
        //Params
        var libelle = req.body.libelle;
        var date = req.body.date;
        
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
    }

}