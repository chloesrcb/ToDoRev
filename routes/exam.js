var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  console.log("Exam");
  res.render('exam', { title: 'Examens' });
});

module.exports = router;