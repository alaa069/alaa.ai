const db = require('./dbk').intents
const UNE = require('./dbk').unique_intent_entities

function getSingleIntent(req, res, next) {
    var intentID = parseInt(req.params.intent_id);
    db.findOne({ intent_id: intentID }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getAgentIntents(req, res, next) {
    console.log("intents.getAgentIntents");
    var AgentID = parseInt(req.params.agent_id);
    db.find({ agent_id: AgentID }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getUniqueIntents(req, res, next) {
    console.log("intents.getUniqueIntents");
    var IntentID = parseInt(req.params.intent_id);
    UNE.find({ intent_id: IntentID }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function createAgentIntent(req, res, next) {
    console.log("intents.createAgentIntent");
    var new_agentIntent = new db(req.body);
    new_agentIntent.save(function (err, fact) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted' });
        }
    });
}

function removeIntent(req, res, next) {
    var intentID = parseInt(req.params.intent_id);
    db.remove({intent_id: intentID}, function (err, fact) {
        if (err) return next(err);
        var count = 4//await db.count({});
        res.status(200).json({status: 'success',message: 'Removed '+ count});
    });
}

module.exports = {
    getAgentIntents: getAgentIntents,
    createAgentIntent: createAgentIntent,
    getSingleIntent: getSingleIntent,
    removeIntent: removeIntent,
    getUniqueIntents: getUniqueIntents
};
