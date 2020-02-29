var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  console.log("Revision");
  res.render('revisions', { title: 'Revisions' });
});

module.exports = router;