var express = require('express');
var router = express.Router();
var url = require('url');
var jwtUtils= require('../utils/jwt.utils');
var cookieParser = require('cookie-parser');
var matiereCtrl = require('./matiereCtrl');
var ligneCtrl = require('./ligneCtrl');
var colonneCtrl = require('./colonneCtrl');
var caseCtrl = require('./caseCtrl');
var revisionCtrl = require('./revisionCtrl');
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
        var q = url.parse(req.baseUrl, true);
        var matiereName=q.pathname.split('/')[2]; 
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          if(matiereId==undefined)
            return res.status(401).json({err: 'Matiere non trouvée'});
          ligneCtrl.getLignes(req,res,matiereId,function(ligneList){
            colonneCtrl.getColonnes(req,res,matiereId,function(colonneList){
              var ensembleCase=[];
              var eventEmitter = new events.EventEmitter();
              eventEmitter.on("caseCatch",function(req,res,userId,matiereName,ligneList,ensembleCase,colonneList){
                
                matiereCtrl.getMatieres(req,res,userId,function(matieresList){
                  var caseList=trieCase(ensembleCase);
                  return res.render('revisions', { title: 'Révision',nomMatiere:matiereName, colonneList:colonneList, ligneList:ligneList , caseList:caseList, matieresList:matieresList });
    
                })
              })

              for(let i=0 ; i<=ligneList.length ; i++){
                if(i==ligneList.length){
                  eventEmitter.emit("caseCatch",req ,res,userId,matiereName,ligneList,ensembleCase,colonneList)
                  break;
                }
                
                caseCtrl.getCases(req,res,ligneList[i].dataValues.id,ensembleCase,pushTab,i)
              }
              
              

            })
            
          })
        })
      }
      }

  
});


router.post('/newColonne', function(req, res, next) {
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
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          revisionCtrl.addColonne(req,res,matiereId,0)
        })


      }
    }
});

router.post('/newLigne', function(req, res, next) {
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
        matiereCtrl.getMatiereId(matiereName,userId,function(matiereId){
          revisionCtrl.addLigne(req,res,matiereId,0)
        })


      }
    }
});

router.patch('/',function(req,res,next){
  
  var q = url.parse(req.baseUrl, true);
  var pathTab=q.pathname.split("/");
  var itemId=pathTab[5]; 
  caseCtrl.modifyItem(req,res,itemId,function(){
    res.redirect(200,"/home");
  })
  //res.redirect(200,"/home");
});




var trieCase=function(tab){
  tab.sort(fctComp);
  newTab=[]
  for(var i=0;i<tab.length;i++){
    newTab.push(tab[i].caseList)
  }
  return newTab
}

var fctComp=function(a,b){
  if(a.i<b.i)
    return -1;
  else if(a.i>b.i)
    return 1;
  else
    return 0;
}

var pushTab=function(tab,caseList,i){
  tab.push({i,caseList});
}

module.exports = router;