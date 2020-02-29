var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');

module.exports = {
    addCase: function(req, res,idLigne,idColonne){
        models.CaseTab.findOne({
            where: {libExam: libelle,
                id_Colonne=idColonne,
                id_Ligne:idLigne }
        })
        .then(function(caseFound){
            if(!caseFound){
                var newCase = models.CaseTab.create({
                    estCoche: '0',
                    id_Ligne: idLigne,
                    id_Colonne: idColonne,
                    ColonneId:idColonne,
                    LigneId:idLigne
                })
                .then(function(newCase){
                    res.status(200)
                    return res.redirect("/home");
                })
                .catch(function(err){
                    return res.status(500).json({'error':err});
                });
            }else{
                return res.status(409).json({ 'error': 'Case already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': err});
        });
    },

    getCases:function(req, res,idLigne,callback){
        models.CaseTab.findAll({
            where: {id_Ligne:idLigne}
        })
        .then(function(casesFound){
            if(casesFound){
                callback(casesFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Cases'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    }

}