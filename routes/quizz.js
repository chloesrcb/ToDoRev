var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  console.log("Quizz");
  res.render('quizz', { title: 'Se tester' });
});

module.exports = router;