const db = require('./dbk').entities

function getAllEntities(req, res, next) {
    console.log("Entities.getAllEntities");
    db.find({}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getSingleEntity(req, res, next) {
    console.log("Entities.getSingleEntity");
    var entityID = parseInt(req.params.entity_id);
    db.findOne({ entity_id: entityID }, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function createEntity(req, res, next) {
    console.log("Entities.createEntity");
    var new_entity = new db(req.body);
    new_entity.save(function (err, fact) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted' });
        }
    });
}

function updateEntity(req, res, next) {
    console.log("Entities.updateEntity");
    var entityID = parseInt(req.params.entity_id);
    var entityName = req.body.entity_name;
    db.findOne({ entity_id: agentID }, function (err, doc) {
        if (err) return next(err);
        doc.entity_id = entityID
        doc.entity_name = entityName
        doc.save(function (err, fact) {
            if (err) {
                return next(err);
            } else {
                res.status(200).json({ status: 'success', message: 'Updated entity' });
            }
        });
    })
}

function removeEntity(req, res, next) {
    var entityID = parseInt(req.params.entity_id);
    db.remove({entity_id: entityID}, function (err, fact) {
        if (err) return next(err);
        var count = 4//await db.count({});
        res.status(200).json({status: 'success',message: 'Removed '+ count});
    });
}

module.exports = {
    getAllEntities: getAllEntities,
    getSingleEntity: getSingleEntity,
    createEntity: createEntity,
    updateEntity: updateEntity,
    removeEntity: removeEntity
};
