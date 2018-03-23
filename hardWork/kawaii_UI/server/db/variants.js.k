const db = require('./dbk').synonym_variant;
const entity_synonym_variants = require('./dbk').entity_synonym_variants;

function getSingleVariant(req, res, next) {
  console.log("variants.getSingleVariant");
  var synonymVariantId = parseInt(req.params.synonym_variant_id);
  db.findOne({ synonym_variant_id: synonymVariantId }, function (err, doc) {
    if (err) return next(err);
    res.status(200).json(doc);
  })
}


function getEntitySynonymVariants(req, res, next) {
  console.log("variants.getSynonymVariants");
  var synonymId = parseInt(req.params.synonym_id);
  entity_synonym_variants.findOne({ synonym_id: synonymId }, function (err, doc) {
    if (err) return next(err);
    res.status(200).json(doc);
  })
}

function getEntitySynonymVariantsQuery(req, res, next) {
  console.log("variants.getEntitySynonymVariantsQuery");
  var entityIds = req.query.entity_ids;
  var entityId = entityIds.split(',');
  var condition = [];
  for (var i = 0; i < entityId.length; i++) {
    condition.push({ entity_id: entityId[i] })
  }
  entity_synonym_variants.findOne({ $or:condition }, function (err, doc) {
    if (err) return next(err);
    res.status(200).json(doc);
  })
}

function createVariant(req, res, next) {
  console.log("variants.createVariant");
  console.log(req.body);
  var new_variant = new db(req.body);
  new_variant.save(function (err, fact) {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ status: 'success', message: 'Inserted' });
    }
  })
}

function removeVariant(req, res, next) {
  console.log("variants.removeVariant");
  var variantId = parseInt(req.params.synonym_variant_id);
  db.remove({ synonym_variant_id: variantId }, function (err, doc) {
    if (err) return next(err);
    var count = 4
    res.status(200).json({ status: 'success', message: 'Removed' + count })
  })
}

function removeSynonymVariants(req, res, next) {
  console.log("variants.removeSynonymVariants");
  var synonymId = parseInt(req.params.synonym_id);
  db.remove({ synonym_id: synonymId }, function (err, fact) {
    if (err) return next(err);
    var count = 4;
    res.status(200)
      .json({
        status: 'success',
        message: 'Removed' + count
      });
  })
}

module.exports = {
  getSingleVariant: getSingleVariant,
  getEntitySynonymVariants: getEntitySynonymVariants,
  createVariant: createVariant,
  removeVariant: removeVariant,
  removeSynonymVariants: removeSynonymVariants,
  getEntitySynonymVariantsQuery: getEntitySynonymVariantsQuery
};