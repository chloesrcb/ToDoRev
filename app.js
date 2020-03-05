var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/logIn');
var inscriptionRouter = require('./routes/inscription');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

var homeRouter = require('./routes/home');
var examRouter = require('./routes/exam');
var quizzRouter = require('./routes/quizz');
var todoRouter = require('./routes/todo');
var revisionsRouter = require('./routes/revisions');
var matieresRouter = require('./routes/matieres');
var questionRouter = require('./routes/question');
var disconnectRouter = require('./routes/disconnect');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inscription', inscriptionRouter);
app.use('/login', loginRouter);
app.use('/test', testRouter);
app.use('/home', homeRouter);
app.use('/disconnect', disconnectRouter);
//app.use('/matiere/*', matieresRouter);

app.use('/matiere/*/se_tester/*/editer', questionRouter);
app.use('/matiere/*/se_tester', quizzRouter);
app.use('/matiere/*/examens', examRouter);
app.use('/matiere/*/revisions', revisionsRouter);
app.use('/matiere/*/a_faire', todoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
