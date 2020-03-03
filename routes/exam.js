var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var matiereCtrl = require('./matiereCtrl');
var examCtrl = require('./examCtrl');

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
          examCtrl.getExams(req,res,matiereId,function(itemsList){
            matiereCtrl.getMatieres(req,res,userId,function(matieresList){
              console.log(itemsList)
                res.render('exam', { title: 'Examens',nomMatiere:matiereName, itemsList:itemsList, matieresList:matieresList });

            })
          })
        })
      }
        //res.render('exam', { title: 'A faire' });
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
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          examCtrl.addExam(req,res,matiereId);
        })
      }
    }
});
module.exports = router;
