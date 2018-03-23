const db = require('./db')

function getWebhook(req, res, next) {
  console.log("webhook.getWebhook");
  db.any('select * from responsespost')
  .then(function (data) {
   res.json(data);
  })
  .catch(function (err) {
    return next(err);
  });
 
}



function addWebhook(req, res, next) {
  console.log("webhook.addWebhook");
  db.any('insert into responsespost(' + 
  'intent_id, agent_id, response_text, response_name, response_url, response_header_username, response_header_password, response_header_key0, response_header_value0, response_header_key1, response_header_value1, response_header_key2, response_header_value2, response_type)' +
  'values(${intent_id}, ${agent_id}, ${response_text}, ${name}, ${URL}, ${username}, ${password}, ${key0}, ${value0}, ${key1}, ${value1}, ${key2}, ${value2}, ${response_type})',
  req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted'
        });
    })
  .catch(function (err) {
    console.log(err)
    return next(err);
  });
}

function removeWebhook(req, res, next) {
  console.log("webhook.removeWebhook", req.params);
  var responseID = parseInt(req.params.response_id);
  db.result('delete from responsespost where response_id = $1', responseID)
  .then(function (result) {

    res.status(200)
      .json({
        status: 'success',
        message: 'Removed ' +result.rowCount
      });
    /* jshint ignore:end */
  })
  .catch(function (err) {
    return next(err);
  });
}

function updateWebhook(req, res, next) {
  console.log("webhook.updatewebhook");
  return next()
  res.status(200).json('done');
}

function testWebhook(req, res, next) {
  var emitter = webHooks.getEmitter()
  
  emitter.on('*.success', function (shortname, statusCode, body) {
      console.log('Success on trigger webHook', shortname, 'with status code', statusCode, 'and body', body)
      res.status(200).json(JSON.parse(body));
  })
   
  emitter.on('*.failure', function (shortname, statusCode, body) {
      console.error('Error on trigger webHook', shortname, 'with status code', statusCode, 'and body', body)
      return next()
  })
  
  webHooks.trigger('web'/*, {data: 123}, {header: 'header'}*/)
}

module.exports = {
    addWebhook: addWebhook,
    removeWebhook: removeWebhook,
    testWebhook: testWebhook,
    getWebhook: getWebhook
};
