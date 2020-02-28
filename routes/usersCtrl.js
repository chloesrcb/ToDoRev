var bcrypt  = require('bcrypt');
var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
module.exports = {
    register: function(req, res){
        //Params
        var email = req.body.email;
        var password = req.body.password;
        var nom = req.body.nom;
        var prenom = req.body.prenom;
        
        if(email==null || password==null || nom==null || prenom==null){
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.User.findOne({
            attributes: ['email'],
            where: {email: email}
        })
        .then(function(userFound){
            if(!userFound){
                bcrypt.hash(pasword,5,function(err, bcryptedMdp){
                    var newUser = models.User.create({
                        email: email,
                        password : bcryptedMdp,
                        nom: nom,
                        prenom: prenom,
                        anneeEtude: anneeEtude
                    })
                    .then(function(newUser){
                        return res.status(201).json({'userId': newUser.id})
                    })
                    .catch(function(err){
                        return res.status(500).json({'error':'cannot add user'});
                    });
                })
            }else{
                return res.status(409).json({ 'error': 'user already exist'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'unable to verify is user already exist'});
        });
    },
    logIn: function(req,res){
        //Param
        var email = req.body.email;
        var password = req.body.password;
        if(email==null || password==null ){
            return res.status(400).json({'error': 'missing parameters'});
        }
        models.User.findOne({
            where: {email: email}
        })
        .then(function(userFound){
            if(userFound){
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if(resBycrypt){
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    }else{
                        return res.status(403).json({'error': 'invalid password'});
                    }

                })
            }else{
                return res.status(404).json({ 'error': 'user not exist in DB' });
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'unable to verify user'});
        });
    }

}