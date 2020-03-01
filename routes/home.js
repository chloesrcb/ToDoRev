var express = require('express');
var router = express.Router();
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var userCtrl = require('./usersCtrl');
var matiereCtrl = require('./matiereCtrl');

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
      matiereCtrl.getMatieres(req,res,userId,function(matieresList){
        userCtrl.getClient(userId,req,res,function(user){
          //if(user===undefined)return;
          res.render('home', { title: 'Home',userId: user,matieresList:matieresList });
        });
      })

    }
  }
});

router.post('/',function(req,res,next){
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
      matiereCtrl.addMat(req,res,userId)
      //res.render('home', { title: 'Home',userId: userId });
    }

    }
});

module.exports = router;