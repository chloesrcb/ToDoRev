var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addQuestion: function(req, res,idQuizz){
        //Params
        var question = req.body.question;
        var reponse = req.body.reponse;
        
        if(question==undefined || reponse==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Question.findOne({
            where: {Question: question, Reponse:reponse, id_Quizz:idQuizz }
        })
        .then(function(questionFound){
            if(!questionFound){
                var newQuestion = models.Question.create({
                    Question: question,
                    Reponse:reponse,
                    id_Quizz:idQuizz,
                    QuizzId:idQuizz
                })
                .then(function(newQuestion){
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

    getQuestions:function(req, res,idQuizz,callback){
        console.log("On entre questions "+idQuizz)
        models.Question.findAll({
            where: {id_Quizz:idQuizz}
        })
        .then(function(questionsFound){
            console.log("test "+questionsFound[0].dataValues.Question)
            if(questionsFound){
                console.log("Trouvé")
                callback(questionsFound);
            }
            else{
                console.log("Pas trouve")
                callback(undefined);
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}