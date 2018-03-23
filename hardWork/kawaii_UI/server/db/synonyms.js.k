const db = require('./dbk').synonyms

function getSingleSynonym(req, res, next){
    console.log("synonym.getSingleSynonym");
    var synonymId = parseInt(req.params.synonym_id);
    db.findOne({synonym_id : synonymId},function(err, doc){
        if(err) return next(err);
        res.status(200).json(doc);

    })    
}

function getEntitySynonyms(req, res, next){
    console.log("synonym.getEntitySynonyms");
    var entityId = parseInt(req.params.entity_id);
    db.findOne({entity_id : entityId},function(err, doc){
        if(err) return next(err);
        res.status(200).json(doc);
    })
}

function createEntitySynonym(req, res, next) {
  console.log("synonym.createEntitySynonym");
   var new_entity = new db(req.body.entity_id, req.body.synonym_reference);
    new_entity.save(function (err, fact) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({ status: 'success', message: 'Inserted' });
        }
    });
}


function removeSynonym(req, res, next) {
  console.log("synonym.removeExpression");
  var synonymId = parseInt(req.params.synonym_id);
  db.remove({synonym_id: synonymId},function(err, doc){
  if (err) return next(err);
        var count = 4//await db.count({});
        res.status(200).json({status: 'success',message: 'Removed '+ count});
    });
}

module.exports = {
  getSingleSynonym: getSingleSynonym,
  getEntitySynonyms: getEntitySynonyms,
  createEntitySynonym: createEntitySynonym,
  removeSynonym: removeSynonym
};