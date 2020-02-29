var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var userCtrl = require('./usersCtrl');
var matiereCtrl = require('./matiereCtrl');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("La");
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
            console.log("Identite confirmé:" +userId);
            var q = url.parse(req.baseUrl, true);
            var matiereName=q.pathname.split('/')[2]; 
            switch(onglet){


            }

            matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                console.log(matiereName);
                console.log("Tu devrais pas etre ici")
                matieresList.forEach(matiere => {
                        if(matiereName==matiere.dataValues.libelle_Matiere){
                            console.log("La! id= "+matiere.dataValues.id);
                        }
                });
                userCtrl.getClient(userId,req,res,function(user){
                //if(user===undefined)return;
                res.render('home', { title: 'Home',userId: user,matieresList:matieresList });
            });
        })

        }
    }
    //res.render('test');
});

module.exports = router;