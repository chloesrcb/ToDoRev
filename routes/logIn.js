var express = require('express');
var router = express.Router();
var userCtrl = require('./usersCtrl');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{title: 'Connexion'});
});

router.post('/',userCtrl.logIn);
module.exports = router;
