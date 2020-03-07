var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

module.exports = {
    addTodoItem: function(req, res,idMatiere){
        //Params
        var contenu = req.body.contenu;

        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        contenu=DOMPurify.sanitize(contenu);

        if(contenu==undefined){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.todolistitem.findOne({
            where: {contenu: contenu,
                id_Matiere:idMatiere }
        })
        .then(function(itemFound){
            console.log(itemFound);
            if(!itemFound){
                var newItem = models.todolistitem.create({
                    contenu: contenu,
                    done: 0,
                    id_Matiere:idMatiere,
                    MatiereId:idMatiere
                })
                .then(function(newItem){
                    res.status(200)
                    return res.redirect("/home");
                })
                .catch(function(err){
                    return res.status(500).json({'error':err});
                });
            }else{
                return res.status(409).json({ 'error': 'Item already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': err});
        });
    },

    modifyItem:function(req,res,matiereID,idItem,callback){
        models.todolistitem.findOne({
            where: {id:idItem, id_Matiere:matiereID}
        })
        .then(function(itemFound){
            if(itemFound){
                console.log(itemFound.dataValues.done)
                itemFound.update({done:!itemFound.dataValues.done});
                callback();
            }
            else{
                return res.status(409).json({ 'error': 'No Items'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },


    getItems:function(req, res,idMatiere,callback){
        models.todolistitem.findAll({
            where: {id_Matiere:idMatiere},
            order: [['done','ASC']]
        })
        .then(function(itemsFound){
            if(itemsFound){
                callback(itemsFound);
            }
            else{
                return res.status(409).json({ 'error': 'No Items'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err});
        });
    },

    delItem:function(req,res,idItem,callback){
        models.todolistitem.destroy({
            where: {id:idItem}
        })
        .then(function(itemFound){
            if(itemFound){
                callback();
            }
            else{
                return res.status(409).json({ 'error': 'No Items'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'No Items'});
        });
    },
    delAllItem:function(req,res,idMatiere,callback){
        models.todolistitem.destroy({
            where: {id_Matiere:idMatiere}
        })
        .then(function(itemFound){
            if(itemFound){
                callback();
            }
            else{
                callback();
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'No Items'});
        });
    }

}