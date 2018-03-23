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
const request = require("request");
const url = require('url');

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

app.use(function (req, res, next) {

    if (req.session && req.session.user) {
        UsersDB.findOne({ Mail: req.session.user.Mail }, '_id FirstName LastName FullName Username Mail Password', function (err, user) {
            if (user) {
                //req.user = user;
                //delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                req.session.user.PasswordView = '';
                res.locals.user = req.session.user;
                res.locals.req = req;
                res.locals.res = res;
            } else {
                req.session.reset();
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        req.session.reset();
        next();
    }
});

var kawaii_response, response_text, response_text_post

app.use('/api/v2/nlu', function (req, res) {
    console.log('/api/v2/nlu')
    try {
        //Strip /api off request
        var request_url = req.originalUrl.split('/nlu')[1];

        if (!request_url) { res.status(500).json({ message: '', error: true, error: "Server Error" }); return; }

        console.log(req.method + ": " + request_url + " -> " + config.kawaiiserver + request_url);

        var path = url.parse(req.url).pathname.split('/').pop();

        if (req.method === 'GET') {
            kawaii_response = "";
            response_text = "";
            response_text_post = "";

            request(config.kawaiiserver + request_url, function (error, response, body) {
                try {
                    if (body !== undefined) {
                        if (path == 'parse') {
                            if (!req.query.model){ res.status(500).json({ message: '', error: true, error: "Invalid format: model is requires" }); return; }
                            if (!req.query.q){ res.status(500).json({ message: '', error: true, error: "Invalid format: q is requires" }); return; }
                            kawaii_response = body;
                            var kawaii_responses = JSON.parse(kawaii_response)
                            var intent_confidence = kawaii_responses[0].intent.confidence;
                            var j = 0
                            for (var i = 0; i < kawaii_responses.length; i++) {
                                if (intent_confidence < kawaii_responses[i].intent.confidence) {
                                    intent_confidence = kawaii_responses[i].intent.confidence
                                    j = i;
                                }
                                if (i + 1 == kawaii_responses.length) {
                                    kawaii_response = kawaii_responses[j]
                                    //getResponseText(kawaii_responses[j].intent.name, kawaii_responses[j].entities, res) // ====>  DataBase Respense 
                                    //augmentParse(res);   //  ====> Add Response from DB to Res JSON
                                    res.status(200).json(kawaii_response)
                                }
                            }
                        } else if (path == 'status') {
                            //sendOutput(200, res, body);
                            res.status(200).json(JSON.parse(body))
                        } else if (path == 'version') {
                            //sendOutput(200, res, body);
                            res.status(200).json(JSON.parse(body))
                        } else if (path == 'config') {
                            //sendOutput(200, res, body);
                            res.status(200).json(JSON.parse(body))
                        } else {
                            res.status(404).json({ message: '', error: true, error: "Server Error" })
                        }
                        // TODO: Check that the response includes the required fields, otherwise, return the incomplete flag? Maybe this should rather be in the backend
                    } else {
                        //sendOutput(404, res, '{"error" : "Server Error"}');
                        res.status(404).json({ message: '', error: true, error: "Server Error" })
                    }
                    //res.end();
                } catch (err) {
                    console.log(err);
                }
            });
        } else if (req.method === 'OPTIONS') {
            try {
                //sendOutput(200, res);
                res.status(200).json({ message: 'OPTIONS', error: false })
            } catch (err) {
                console.log(err);
            }
        } else {
            request({
                method: req.method,
                uri: config.kawaiiserver + request_url,
                body: JSON.stringify(req.body),
                headers: req.headers
            }, function (error, response, body) {
                try {
                    //sendOutput(200, res, "");
                    res.status(200).json({ message: '', error: false })
                    console.log(response);
                } catch (err) {
                    console.log(err);
                }
            });
        }

        if (path == 'parse') {
            //var model = getParameterByName('model', request_url) !== undefined ? getParameterByName('model', request_url) : "default";
            //logRequest(req, path, { model: model, intent: '', query: getParameterByName('q', request_url) });
        } else {
            //logRequest(req, path);
        }
    } catch (err) {
        console.log("Error: " + err);
    }
});

function augmentParse(res) {
    if (kawaii_response !== '' && response_text !== '') {
        var objResponse = kawaii_response;
        //var objResponse = JSON.parse(kawaii_response);
        //objResponse.response_text = response_text;
        //for(var i = 0; i < objResponse.length; i++){
        //objResponse.push({response_text: response_text});
        objResponse.response_text = response_text;
        objResponse.response_text_post = response_text_post;
        //}
        sendOutput(200, res, JSON.stringify(objResponse));
    }
    if (kawaii_response !== '' && response_text_post !== '') {
        var objResponse = kawaii_response;
        objResponse.response_text = response_text;
        objResponse.response_text_post = response_text_post;
    }
}

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