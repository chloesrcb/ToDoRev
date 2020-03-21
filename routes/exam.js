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
      res.status(401);
      res.redirect("/login");
  }
  else{
      userId=jwtUtils.verify(token);
      if(userId===undefined){
          res.status(401);
          res.redirect("/login");
      }
      else{
        var q = url.parse(req.baseUrl, true);
        var matiereName=decodeURI(q.pathname.split('/')[2]); 
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          if(matiereId==undefined)
            return res.status(401).json({err: 'Matiere non trouvée'});
          examCtrl.getExams(req,res,matiereId,function(itemsList){
            matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                res.render('exam', { title: 'Examens',nomMatiere:matiereName, itemsList:itemsList, matieresList:matieresList });

            })
          })
        })
      }
        //res.render('exam', { title: 'A faire' });
      }

  
});


router.post('/', function(req, res, next) {
  var token =req.cookies.token;
  if(token === undefined){ 
      res.status(401);
      res.redirect("/login");
  }
  else{
      userId=jwtUtils.verify(token);
      if(userId===undefined){
          res.status(401);
          res.redirect("/login");
      }
      else{
        var q = url.parse(req.baseUrl, true);
        var matiereName=decodeURI(q.pathname.split('/')[2]); 
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          examCtrl.addExam(req,res,matiereId);
        })
      }
    }
});

router.delete('/',function(req,res,next){
  var token =req.cookies.token;
  if(token === undefined){ 
      res.status(401);
      res.redirect("/login");
  }
  else{
      userId=jwtUtils.verify(token);
      if(userId===undefined){
          res.status(401);
          res.redirect("/login");
      }
      else{
        var q = url.parse(decodeURI(req.baseUrl), true);
        var pathTab=q.pathname.split("/");
        var matiereName=decodeURI(pathTab[2]); 
        var itemId=decodeURI(pathTab[4]); 
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          examCtrl.delExam(req,res,matiereId,itemId,function(){
            res.redirect(200,"/home");
          })
        });
      }
    }
});
module.exports = router;
