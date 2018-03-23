const db = require('./dbk').expressions

function getSingleExpression(req, res, next) {
    console.log("expression.getSingleExpression");
    var expressionId = parseInt(req.params.expression_id);
    db.findOne({ expression_id: expressionId }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getIntentExpressions(req, res, next) {
    console.log("expression.getIntentExpressions");
    var intentId = parseInt(req.params.intent_id);
    db.findOne({ intent_id: intentId }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getIntentExpressionQuery(req, res, next) {
    console.log("expression.getIntentExpressionQuery");
    var IntentIds = req.query.intent_ids;
    var IntentId = IntentIds.split(',');
    var condition = [];
    for(var i=0; i<IntentId.length; i++){
        condition.push({intent_id: IntentId[i]})
    }
    db.find({ $or:condition}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function createIntentExpression(req, res, next) {
    console.log("expressions.createIntentExpression");
    var new_expression = new db(req.body);
    new_expression.save(function (err, fact) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted' });
        }
    });
}

function removeExpression(req, res, next) {
    console.log("expressions.removeExpression");
    var expressionId = parseInt(req.params.expression_id);
    db.remove({expression_id: expressionId}, function (err, fact) {
        if (err) return next(err);
        var count = 4//await db.count({});
        res.status(200).json({status: 'success',message: 'Removed '+ count});
    });
}

module.exports = {
    getSingleExpression: getSingleExpression,
    getIntentExpressions: getIntentExpressions,
    createIntentExpression: createIntentExpression,
    removeExpression: removeExpression,
    getIntentExpressionQuery: getIntentExpressionQuery
};
