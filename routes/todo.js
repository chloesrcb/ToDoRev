var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var matiereCtrl = require('./matiereCtrl');
var todoCtrl = require('./todolistCtrl');


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
          todoCtrl.getItems(req,res,matiereId,function(itemsList){
            matiereCtrl.getMatieres(req,res,userId,function(matieresList){
              //console.log(matieresList)
                res.render('todo', { title: 'A faire',nomMatiere:matiereName, itemsList:itemsList, matieresList:matieresList });

            })
          })
        })
      }
        //res.render('todo', { title: 'A faire' });
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
          todoCtrl.addTodoItem(req,res,matiereId);
        })
      }
    }
});

router.patch('/',function(req,res,next){
  
  var q = url.parse(req.baseUrl, true);
  var pathTab=q.pathname.split("/");
  var itemId=pathTab[5]; 
  todoCtrl.modifyItem(req,res,itemId,function(){
    res.redirect(200,"/home");
  })
});

router.delete('/',function(req,res,next){
  var q = url.parse(req.baseUrl, true);
  var pathTab=q.pathname.split("/");
  var itemId=pathTab[5]; 
  todoCtrl.delItem(req,res,itemId,function(){
    res.redirect(200,"/home");
  })
});

module.exports = router;