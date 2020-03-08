var express = require('express');
var router = express.Router();
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var userCtrl = require('./usersCtrl');
var matiereCtrl = require('./matiereCtrl');
var examCtrl = require('./examCtrl');
var todoCtrl = require('./todolistCtrl');
const events = require('events');

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
        
        var ensExams=[];
        var ensTodo=[];
        var nDate=0;
        var nTodo=0;
        var eventEmitter = new events.EventEmitter();
        eventEmitter.on("homePret",function(req,res,userId,ensExams,ensTodo){
        
          console.log("Le tab:"+ensExams)
          matiereCtrl.getMatieres(req,res,userId,function(matieresList){
            return res.render('home', { title: 'Home', exams:ensExams, matieresList:matieresList ,todos:ensTodo});
          })
        });

        eventEmitter.on("dateRecup",function(req,res,userId,ensExams,matieresList){
          for(var i=0;i<matieresList.length;i++){
            todoCtrl.getItemsForHome(req,res,matieresList[i].dataValues.id,matieresList[i].dataValues.libelle_Matiere,function(todos,matiereName){
              console.log("on pousse"+nTodo)
              nTodo++;
              if(todos.length>0){
                ensTodo.push("/matiere/"+matiereName+"/a_faire");
              }
              if(nTodo==matieresList.length-1){
                eventEmitter.emit("homePret",req,res,userId,ensExams,ensTodo)
              }
            })
          }


        });

        for(var i=0;i<matieresList.length;i++){
          examCtrl.getExamWithinTwoWeeks(req,res,matieresList[i].dataValues.id,matieresList[i].dataValues.libelle_Matiere,function(exams,matiereName){
            console.log("on pousse"+nDate)
            nDate++;
            if(exams.length>0){
              ensExams.push("/matiere/"+matiereName+"/examens");
            }
            if(nDate==matieresList.length-1){
              eventEmitter.emit("dateRecup",req,res,userId,ensExams,matieresList)
            }
          })
        }
        
        //eventEmitter.emit("dateRecup",req,res,userId,ensExams)
        
       // res.render('home', { title: 'Home', exams:ensExams, matieresList:matieresList });
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

var pushTab=function(tab,caseList,i){
  tab.push({i,caseList});
}