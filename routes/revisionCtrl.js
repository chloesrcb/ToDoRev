var ligneCtrl = require('./ligneCtrl');
var colonneCtrl = require('./colonneCtrl');
var caseCtrl = require('./caseCtrl');
var models  = require('../models');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

/*
**Ce fichier reuni les fonctions qui affecte les lignes et les colonnes de Revisions
**pour eviter une dépendance circulaire entre ligneCtrl et colonneCtrl
*/

module.exports = {

    addLigne: function(req, res,idMatiere,numLigne){
        //Params
        var libelle = req.body.libelle;

        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        libelle=DOMPurify.sanitize(libelle);

        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Ligne.findOne({
            where: {libLigne: libelle,
                numLigne:numLigne,
                id_Matiere:idMatiere }
        })
        .then(function(ligneFound){
            if(!ligneFound){
                console.log("On creer la ligne")
                var newLigne = models.Ligne.create({
                    libLigne: libelle,
                    numLigne:numLigne,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newLigne){
                    console.log("ligne Creee: "+newLigne.id)
                    var idLigne=newLigne.id;
                    colonneCtrl.getColonnes(req,res,idMatiere,function(colonneList){
                       console.log("On a tous ce quil faut pour les cases, nbColonne:"+colonneList.length);
                       var i=0; 
                       while(i<colonneList.length){
                            console.log('on cree la case ('+i+','+1+')');
                            caseCtrl.addCase(req,res,idLigne,colonneList[i].dataValues.id);
                            console.log('cree')
                            i++;
                        }

                        res.status(200)
                        return res.redirect("/home");
                    });
                })
                .catch(function(err){
                    return res.status(500).json({'error':'err catch au debut'});
                });
            }else{
                return res.status(409).json({ 'error': 'Ligne already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'erreur catch a la fin'});
        });
    },


    delLigne:function(req,res,idItem,callback){
        //on delete les cases avant pour la contrainte foreign_key
        caseCtrl.delCasesFromLigne(req,res,idItem,function(){
            models.Ligne.destroy({
                where: {id:idItem}
            })
            .then(function(itemFound){
                if(itemFound){
                    callback();
                    //return res.status(500).json({ 'error': 'No Items'});
                }
                else{
                    return res.status(409).json({ 'error': 'No Items'});
                }
            })
            .catch(function(err){
                console.log("soucis:" +err)
                return res.status(500).json({ 'error': 'No Items'});
            });
        });
    },

    delColonne:function(req,res,idItem,callback){
        console.log("on supprime")
        //on delete les cases avant pour la contrainte foreign_key
        caseCtrl.delCasesFromColonne(req,res,idItem,function(){
            models.Colonne.destroy({
                where: {id:idItem}
            })
            .then(function(itemFound){
                if(itemFound){
                    callback();
                    //return res.status(500).json({ 'error': 'No Items'});
                }
                else{
                    return res.status(409).json({ 'error': 'No Items'});
                }
            })
            .catch(function(err){
                console.log("soucis:" +err)
                return res.status(500).json({ 'error': 'No Items'});
            });
        });
    },


    addColonne: function(req, res,idMatiere,numColonne){
        //Params
        var libelle = req.body.libelle;
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        libelle=DOMPurify.sanitize(libelle);
        if(libelle==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.Colonne.findOne({
            where: {LibColonne: libelle,
                numColonne:numColonne,
                id_Matiere:idMatiere }
        })
        .then(function(colonneFound){
            if(!colonneFound){
                var newColonne = models.Colonne.create({
                    LibColonne: libelle,
                    numColonne:numColonne,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newColonne){
                    console.log("colonne Creee: ");
                    
                    ligneCtrl.getLignes(req,res,idMatiere,function(ligneList){});
                    var idColonne=newColonne.id;
                    console.log("colonne Creee: "+idMatiere);
                    ligneCtrl.getLignes(req,res,idMatiere,function(ligneList){
                        console.log("On a tout ce quil faut pour les cases, nbColonne:"+ligneList.length);
                        var i=0; 
                        while(i<ligneList.length){
                            console.log('on cree la case ('+i+','+1+')');
                            caseCtrl.addCase(req,res,ligneList[i].dataValues.id,idColonne);
                            console.log('cree')
                            i++;
                        }

                        res.status(200)
                        return res.redirect("/home");
                    });
                })
                .catch(function(err){
                    console.log(err);
                    return res.status(500).json({'error':'erreur a la fin'});
                });
            }else{
                return res.status(409).json({ 'error': 'Colonne already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'erreur au debut'});
        });
    },
    
    delAllRevision:function(req,res,idMatiere){
        colonneCtrl.getColonnes(req,res,idMatiere,function(colonneList){
            console.log(colonneList)
            for(var i=0;i<colonneList.length;i++){
                console.log("colId="+colonneList[i].dataValues.id)
                this.delColonne(req,res,colonneList[i].dataValues.id,function(){});
            }
        });
        ligneCtrl.getLignes(req,res,idMatiere,function(ligneList){
            for(var i=0;i<ligneList.length;i++){
                delLigne(req,res,ligneList[i].dataValues.id,function(){});
            }
        });
    }

}