var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var matiereCtrl = require('./matiereCtrl');
var ligneCtrl = require('./ligneCtrl');
var colonneCtrl = require('./colonneCtrl');
var caseCtrl = require('./caseCtrl');
const events = require('events');
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
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          if(matiereId==undefined)
            return res.status(401).json({err: 'Matiere non trouvée'});
          ligneCtrl.getLignes(req,res,matiereId,function(ligneList){
            colonneCtrl.getColonnes(req,res,matiereId,function(colonneList){
              var ensembleCase=[];
              var eventEmitter = new events.EventEmitter();
              console.log("On get les cases")
              eventEmitter.on("caseCatch",function(req,res,userId,matiereName,ligneList,ensembleCase,colonneList){
                
                matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                  console.log(matieresList)
                  console.log("matiere get")
                  return res.render('revisions', { title: 'Révision',nomMatiere:matiereName, colonneList:colonneList, ligneList:ligneList , caseList:ensembleCase, matieresList:matieresList });
    
                })
              })
              for(var i=0 ; i<=ligneList.length ; i++){
                if(i==ligneList.length){
                  console.log("on emit")
                  eventEmitter.emit("caseCatch",req ,res,userId,matiereName,ligneList,ensembleCase,colonneList)
                  break;
                }
                caseCtrl.getCases(req,res,ligneList[i],ensembleCase,pushTab)
                console.log("on en a une");
              }
              console.log("on sort")
              
              

            })
            
          })
        })
      }
        //res.render('quizz', { title: 'A faire' });
      }

  
});

var pushTab=function(tab,caseList){
  tab.push(caseList);
}

module.exports = router;