const db = require('./dbk').agents

function getAllAgents(req, res, next) {
    console.log("Agents.getAllAgents");
    db.find({}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getSingleAgent(req, res, next) {
    console.log("Agents.getSingleAgent");
    var agentID = parseInt(req.params.agent_id);
    db.findOne({ agent_id: agentID }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function createAgent(req, res, next) {
    console.log("Agent.createAgent");
    var new_agent = new db(req.body);
    new_agent.save(function (err, fact) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted' });
        }
    });
}

function updateAgent(req, res, next) {
    console.log("Agents.updateAgent");
    var agentID = parseInt(req.params.agent_id);
    var agentName = req.body.agent_name;
    db.findOne({ agent_id: agentID }, function (err, doc) {
        if (err) return next(err);
        doc.agent_name = agentName
        doc.agent_id = agentID
        doc.save(function (err, fact) {
            if (err) {
                return next(err);
            } else {
                res.status(200).json({ status: 'success', message: 'Updated agent' });
            }
        });
    })
}

function removeAgent(req, res, next) {
    console.log("Agents.removeAgent");
    var agentID = parseInt(req.params.agent_id);
    db.remove({agent_id: agentID}, function (err, fact) {
        if (err) return next(err);
        var count = 4//await db.count({});
        res.status(200).json({status: 'success',message: 'Removed '+ count});
    });
}

module.exports = {
    getSingleAgent: getSingleAgent,
    getAllAgents: getAllAgents,
    createAgent: createAgent,
    updateAgent: updateAgent,
    removeAgent: removeAgent
};
