var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

module.exports = {
    addQuestion: function(req, res,idQuizz){
        //Params
        var question = req.body.question;
        var reponse = req.body.reponse;
        
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        reponse=DOMPurify.sanitize(reponse);
        question=DOMPurify.sanitize(question);

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

    delQuestion:function(req,res,idItem,callback){
        models.Question.destroy({
            where: {id:idItem}
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
    },

    delAllQuestion:function(req,res,idQuizz,callback){
        models.Question.destroy({
            where: {id_Quizz:idQuizz}
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
    },

    getQuestions:function(req, res,idQuizz,callback){
        models.Question.findAll({
            where: {id_Quizz:idQuizz}
        })
        .then(function(questionsFound){
            if(questionsFound){
                callback(questionsFound);
            }
            else{
                callback(undefined);
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },

    getQuestionFromId:function(req, res,idQuestion,callback){
        models.Question.findOne({
            where: {id:idQuestion}
        })
        .then(function(questionFound){
            if(questionFound){
                callback(questionFound);
            }
            else{
                callback(undefined);
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}