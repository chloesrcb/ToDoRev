//Imports
var bcrypt  = require('bcrypt');
var jwtUtils= require('../utils/jwt.utils');
var models  = require('../models');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

//Constantes
const EMAIL_REJEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REJEX=/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;

module.exports = {
    register: function(req, res){
        //Paramètres
        var email = req.body.email;
        var password = req.body.password;
        var nom = req.body.nom;
        var prenom = req.body.prenom;

        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        email=DOMPurify.sanitize(email);
        password=DOMPurify.sanitize(password);
        nom=DOMPurify.sanitize(nom);
        prenom=DOMPurify.sanitize(prenom);

        //Si il manque une entrée
        if(email==null || password==null || nom==null || prenom==null){
            return res.status(400).json({'error': 'missing parameters'});
        }

        //Si la longueur du nom ou du prénom de convient pas
        if(nom.length<2 || nom.length>=20 || prenom.length<2 || prenom.length>=20){
            res.status(400);
            error={status:400, stack:'stack'}
            return res.render('error',{message: 'invalid name and/or firstname'});
        }
        
        //Email invalid
        
        if(!EMAIL_REJEX.test(email)){
            return res.status(400).json({'error': 'invalid email'});
        }

        //Mot de passe invalide, doit contenir 1 maj, 1 min, 1 nombre, 1 caractère spécial et doit avoir une longueur entre 6 et 10
        if(!PASSWORD_REJEX.test(password)){
            return res.status(400).json({'error': 'invalid password'});
        }

        models.User.findOne({
            attributes: ["email"],
            where: {email: email}
        })
        .then(function(userFound){
            if(!userFound){
                bcrypt.hash(password,5,function(err, bcryptedMdp){
                    var newUser = models.User.create({
                        email: email,
                        password : bcryptedMdp,
                        nom: nom,
                        prenom: prenom
                    })
                    .then(function(newUser){
                        return res.redirect("/login")
                    })
                    .catch(function(err){
                        return res.status(500).json({'error':'cannot add user'});
                    });
                })
            }else{
                return res.status(409).json({ 'error': 'user already exists'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'unable to verify if user already exists'});
        });
    },
    logIn: function(req,res){
        //Param
        var email = req.body.email;
        var password = req.body.password;
        console.log("On cherche")
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        email=DOMPurify.sanitize(email);
        password=DOMPurify.sanitize(password);

        if(email==null || password==null ){
            return res.status(400).json({'error': 'missing parameters'});
        }
        models.User.findOne({
            where: {email: email}
        })
        .then(function(userFound){
            if(userFound){
                console.log("il estd dans le abase")
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if(resBycrypt){
                        var token=jwtUtils.generateTokenForUser(userFound);
                        res.cookie('token',token,{maxAge:3600000, httpOnly: true})
                        res.status(200)
                        console.log("On redirteifge")
                        return res.redirect("/home");
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
    },
    getClient: function(id,req,res,callback){
        
        models.User.findOne({
            where: {id: id}
        })
        .then(function(userFound){
            if(userFound){
                callback( userFound.dataValues);
            }else{
                return res.status(404).json({ 'error': 'user not exist in DB' });
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'unable to find user'});
        });
    }

}