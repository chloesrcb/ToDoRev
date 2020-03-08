var express = require('express');
var router = express.Router();
var url = require('url');
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
            var q = url.parse(req.baseUrl, true);
            var matiereName=q.pathname.split('/')[2]; 

            matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                matieresList.forEach(matiere => {
                        if(matiereName==matiere.dataValues.libelle_Matiere){
                        }
                });
                userCtrl.getClient(userId,req,res,function(user){
                res.render('home', { title: 'Home',userId: user,matieresList:matieresList });
            });
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
            var q = url.parse(req.baseUrl, true);
            var pathTab=q.pathname.split("/");
            var matiereName=pathTab[2];
            matiereCtrl.delMatiere(req,res,matiereName,userId,function(){
                res.redirect(302,"/home");
            });
        }
    }
  });

module.exports = router;