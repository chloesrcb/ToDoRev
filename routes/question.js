var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var matiereCtrl = require('./matiereCtrl');
var questionCtrl = require('./questionCtrl');
var quizzCtrl = require('./quizzCtrl');

/* GET home page. */
router.get('/', function(req, res, next) {
  var token =req.cookies.token;
  if(token === undefined){ 
      console.log("pas de token");
      res.status(401);
      res.redirect("/login");
  }
  else{
      console.log("Il y a un token")
      userId=jwtUtils.verify(token);
      console.log("On a le resultat");
      if(userId===undefined){
          console.log("token invalide");
          res.status(401);
          res.redirect("/login");
      }
      else{
        var q = url.parse(req.baseUrl, true); 
        var matiereName=q.pathname.split('/')[2];
        var libQuizz=q.pathname.split('/')[4];
        var page=q.pathname.split('/')[5];
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          if(matiereId==undefined)
            return res.status(401).json({err: 'Matiere non trouvée'});
            console.log('test')
          quizzCtrl.getQuizzID(req,res,matiereId,libQuizz,function(idQuizz){
              console.log("Ca ressort")
            questionCtrl.getQuestions(req,res,idQuizz,function(itemsList){
                console.log("On a les questions")
                matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                  //console.log(matieresList)
                  if(page=="editer")
                    res.render('editQuizz', { title: libQuizz,nomMatiere:matiereName, questionsList:itemsList, matieresList:matieresList, libQuizz:libQuizz });
                  else 
                    res.render('doQuizz', { title: 'Editer Questionnaire',nomMatiere:matiereName, questionsList:itemsList, matieresList:matieresList, libQuizz:libQuizz });
                })
              })
          })
        })
      }
        //res.render('quizz', { title: 'A faire' });
      }

  
});


router.post('/', function(req, res, next) {
    console.log("Salut")
    var token =req.cookies.token;
    if(token === undefined){ 
        console.log("pas de token");
        res.status(401);
        res.redirect("/login");
    }
    else{
        console.log("Il y a un token")
        userId=jwtUtils.verify(token);
        console.log("On a le resultat");
        if(userId===undefined){
            console.log("token invalide");
            res.status(401);
            res.redirect("/login");
        }
        else{
          var q = url.parse(req.baseUrl, true);
          var matiereName=q.pathname.split('/')[2]; 
          var libQuizz=q.pathname.split('/')[4];
          matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
            quizzCtrl.getQuizzID(req,res,matiereId,libQuizz,function(idQuizz){
                questionCtrl.addQuestion(req,res,idQuizz);
            });
          })
        }
      }
  });

  router.delete('/',function(req,res,next){
    
    var token =req.cookies.token;
    if(token === undefined){ 
        console.log("pas de token");
        res.status(401);
        res.redirect("/login");
    }
    else{
        console.log("Il y a un token")
        userId=jwtUtils.verify(token);
        console.log("On a le resultat");
        if(userId===undefined){
            console.log("token invalide");
            res.status(401);
            res.redirect("/login");
        }
        else{
          var q = url.parse(req.baseUrl, true);
          var pathTab=q.pathname.split("/");
          var itemId=pathTab[6]; 
          questionCtrl.getQuestionFromId(req,res,itemId,function(question){
            if(question){
              quizzCtrl.getQuizzFromId(req,res,question.dataValues.id_Quizz,function(quizz){
                if(quizz){
                  matiereCtrl.getMatiereFromId(req,res,quizz.dataValues.id_Matiere,function(matiere){
                    if(matiere && matiere.dataValues.id_User==userId){
                      questionCtrl.delQuestion(req,res,itemId,function(){
                        res.redirect(200,"/home");
                      })
                    }
                  });
                }
              });
            }
          });
        }
    }
  });

module.exports = router;