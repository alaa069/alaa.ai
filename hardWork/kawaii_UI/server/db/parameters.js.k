const db=require('./dbk').parameters;

function getSingleParameter(req, res, next) {
  var parameterID = parseInt(req.params.parameter_id);
  db.findOne({parameter_id : parameterID}, function(err, doc){
      if(err) return next(err);
      res.status(200).json(doc)
  })
}

function getIntentParameters(req, res, next) {
  console.log("parameters.getExpressionParameters");
  var intentId = parseInt(req.params.intent_id);
  db.find({intent_id : intentId}, function(err, doc){
      if(err) return next(err);
      res.status(200).json(doc);
  })
}

function getExpressionParametersQuery(req, res, next) {
  console.log("parameters.getExpressionParametersQuery");
  var expressionIds = req.query.expression_ids;
  var expressionId = expressionIds.split(',');
  var condition = [];
  for (var i = 0; i < expressionId.length; i++) {
    condition.push({ expression_id: expressionId[i] })
  }
  db.find({ $or:condition }, function(err, doc){
      if(err) {console.log(err);return next(err);}
      res.status(200).json(doc);
  })
}

function updateParameter(req, res, next) {
  console.log("parameters.updateParameter");
  console.log(req.body);
  var entityId = parseInt(req.params.entity_id);
  var parameterID = parseInt(req.params.parameter_id);
  db.findOne({entity_id : entityId}, function(err, doc){
      doc.parameter_id = parameterID;
      doc.save(function(err, fact){
          if (err) {
                return next(err);
            } else {
                res.status(200).json({ status: 'success', message: 'Updated parameter' });
            }
      })
  })
}

function getExpressionParameters(req, res, next) {
  console.log("parameters.getExpressionParameters");
  var expressionId = parseInt(req.params.expression_id);
  db.findOne({expression_id : expressionId}, function(err, doc){
      if(err) return next(err);
      res.status(200)
        .json(doc);
  })
}

function createExpressionParameter(req, res, next) {
  console.log("parameters.createExpressionParameter");
  var new_param = new db(req.body);
  new_param.save(function(err, fact){
      if(err) return next(err);
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted'
        });
    })
}

function removeParameter(req, res, next) {
  var parameterId = parseInt(req.params.parameter_id);
  db.remove({parameter_id : parameterID}, function(err, fact){
      if(err) return next(err);
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount}'
        });
  })
}

module.exports = {
  getSingleParameter: getSingleParameter,
  getExpressionParameters: getExpressionParameters,
  getIntentParameters: getIntentParameters,
  createExpressionParameter: createExpressionParameter,
  removeParameter: removeParameter,
  updateParameter: updateParameter,
  getExpressionParametersQuery: getExpressionParametersQuery
};
