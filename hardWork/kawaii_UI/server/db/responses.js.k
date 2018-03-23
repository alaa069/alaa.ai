const db = require('./dbk').responses;

function getIntentResponses(req, res, next) {
  console.log("responses.getIntentResponses");
  var intentID = parseInt(req.params.intent_id);
  console.log("responses.getIntentResponses ::intentID" +intentID);
  
  db.findOne({intent_id : intentID},function(err, doc){
      if(err) return next(err);
      res.status(200).json(doc);
  })
}

function createIntentResponse(req, res, next) {
  console.log("responses.createIntentResponse");
  //using default response type
  var new_response = new db(req.body);
  new_response.save(function(err, fact){
      if(err) return next(err);
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted'
        });
    })
}

function removeIntentResponse(req, res, next) {
  var responseID = parseInt(req.params.response_id);
  console.log("responses.removeIntentResponse");
  db.remove({response_id : responseID},function(err, doc){
      if(err) return next (err);
      var count =4 ;
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ' + count
        });

  })
}
/// to show alaa
function getRandomResponseForIntent(req, res, next) {
  console.log("responses.getRandomResponseForIntent");
  db.any('SELECT responses.response_text FROM responses, intents where responses.intent_id = intents.intent_id and intents.intent_name = $1 order by random() LIMIT 1', req.query.intent_name)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getIntentResponses: getIntentResponses,
  removeIntentResponse: removeIntentResponse,
  createIntentResponse: createIntentResponse,
  getRandomResponseForIntent:getRandomResponseForIntent
};
