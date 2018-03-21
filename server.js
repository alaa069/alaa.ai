'use strict';

const express = require("express");
const http = require('http');
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const mongoose = require('mongoose');
const UsersDB = require('./models/user');
const session = require('client-sessions');
const routes = require("./routes/index");
const API = require("./routes/api");
const config = require("./config/config");

// Connect to DBs
//mongoose.Promise = require('bluebird');
mongoose.connect(config.urlDataBase)
    .then(() => console.log('Connection to DataBase success'))
    .catch((err) => console.error('Connection to DataBase failed'));
mongoose.set('debug', true);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 40);
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'))
app.use(session({
    cookieName: config.cookieName,
    secret: config.secret,
    duration: 3 * 60 * 60 * 1000,
    activeDuration: 60 * 60 * 1000,
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/", routes);
app.use("/api", API);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// HTTP server
var server = http.createServer(app);
server.listen(config.serverPort, function () {
    console.log('HTTP server listening on port ' + config.serverPort);
});