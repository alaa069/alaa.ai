const express     = require('express');
const proxy       = require('http-proxy-middleware');
const bodyParser  = require('body-parser');
const path        = require("path");
const env         = process.env.NODE_ENV || "development";
const config      = require(path.join(__dirname, 'config', 'config.json'))[env];
const app         = express();
const request     = require('request');
const routes      = require('./routes/index')
const train       = require('./ctrl/train')
const webhooks    = require('./ctrl/webhooks')
const cors        = require('cors')
const db          = require('./db/db')
const url         = require('url');
//const mongoose    = require('mongoose');
const logger      = require('morgan');

// Connect to MongoDB
/*mongoose.Promise = global.Promise;
mongoose.connect(config.DataBaseMongo,{useMongoClient: true,})
  .then(() =>  console.log('Connection to DataBase success'))
  .catch((err) => console.error('Connection to DataBase failed'));
mongoose.set('debug', true);*/

app.use(cors())

app.use(bodyParser.json());
app.use(logger('dev'));

/** Serve static files for UI website on root / */
app.use('/', express.static('web/src/'));

app.use('/api/v2/', routes);
app.post('/train', train.settrain);
app.post('/train/remove', train.removetrain);
app.post('/webhooks', webhooks.index);

/** Middleware layer for logging and then shuttling requests to the Kawaii API */
app.use('/api/v2/kawaii/', function(req, res) {
  try {
    //Strip /api off request
    var request_url = req.originalUrl.split('/kawaii')[1];

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
              kawaii_response = body;
              var kawaii_responses = JSON.parse(kawaii_response)
              var intent_confidence = kawaii_responses[0].intent.confidence;
              var j = 0
              for(var i = 0; i < kawaii_responses.length; i++){
                if (intent_confidence < kawaii_responses[i].intent.confidence){
                  intent_confidence = kawaii_responses[i].intent.confidence
                  j = i;
                }
                if(i+1==kawaii_responses.length){
                  kawaii_response = kawaii_responses[j]
                  getResponseText(kawaii_responses[j].intent.name, kawaii_responses[j].entities, res)
                  //getResponseTextPost(kawaii_responses[j].intent.name, res);
                  augmentParse(res);
                }
              }
            } else {
              sendOutput(200, res, body);
            }
            // TODO: Check that the response includes the required fields, otherwise, return the incomplete flag? Maybe this should rather be in the backend
          } else {
            sendOutput(404, res, '{"error" : "Server Error"}');
          }
          //res.end();
        } catch (err) {
          console.log(err);
        }
      });
    } else if (req.method === 'OPTIONS') {
      try {
        sendOutput(200, res);
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
          sendOutput(200, res, "");
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (path == 'parse') {
      var model = getParameterByName('model', request_url) !== undefined ? getParameterByName('model', request_url) : "default";
      logRequest(req, path, {model: model, intent: '', query: getParameterByName('q', request_url)});
    } else {
      logRequest(req, path);
    }
  } catch (err) {
    console.log("Error: " + err);
  }
});

function augmentParse(res){
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
  if (kawaii_response !== '' && response_text_post !== ''){
    var objResponse = kawaii_response;
    objResponse.response_text = response_text;
    objResponse.response_text_post = response_text_post;
  }
}

function sendOutput(http_code, res, body) {
  res.writeHead(http_code, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  if (body !== "") {
    res.write(body);
  }
  res.end();
}

function getResponseText(intent_name, entities_body, res) {
  db.any('SELECT responses.response_text FROM responses, intents where responses.intent_id = intents.intent_id and intents.intent_name = $1 order by random() LIMIT 1', intent_name)
    .then(function (data) {
      if (data.length > 0) {
        response_text = data[0].response_text;
        response_text_post = undefined;
        augmentParse(res);
      } else {
        db.any('SELECT * FROM responsespost, intents where responsespost.intent_id = intents.intent_id and intents.intent_name = $1 order by random() LIMIT 1', intent_name)
        .then(function (data) {
          if (data.length > 0) {
            var key0   = data[0].response_header_key0
            var value0 = data[0].response_header_value0
            var key1   = data[0].response_header_key1
            var value1 = data[0].response_header_value1
            var key2   = data[0].response_header_key2
            var value2 = data[0].response_header_value2
            var options = { method: 'POST',
              url: data[0].response_url,
              headers: 
              { key0: value0,
                key1: value1,
                key2: value2
              },
              form: 
                { data: entities_body }
            };
            
            request(options, function (error, response, body) {
              if (error) {
                response_text_post = undefined;
                response_text = undefined;
                augmentParse(res);
              }
              else {
                var respPost = JSON.parse(body)
                response_text_post = respPost.displayText;
                response_text = undefined;
                augmentParse(res);
              }
            });
            response_text = undefined;
          } else {
            response_text_post = undefined;
            response_text = undefined;
            augmentParse(res);
          }
        })
        .catch(function (err) {
          //res.write(err);
          console.log(err);
        });
      }
      //augmentParse(res);
    })
    .catch(function (err) {
      //res.write(err);
      console.log(err);
    });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function logRequest(req, type, data) {
  try {
    var obj = {};
    obj.ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    obj.query = req.originalUrl;
    obj.event_type = type;
    obj.event_data = data;

    db.any('insert into nlu_log(ip_address, query, event_type, event_data)' +
      'values(${ip_address}, ${query}, ${event_type}, ${event_data})',
      obj)
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log("Error: " + err);
  }
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

app.listen(5001);
