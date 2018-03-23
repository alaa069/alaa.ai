const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , timestamps = require("mongoose-times")
    , bcrypt = require('bcrypt-nodejs')
    , mongoosePaginate = require('mongoose-paginate')
    , autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var agentsSchema = new Schema({
    agent_id: { type: Number }
    , agent_name: { type: String }
})

var entitiesSchema = new Schema({
    entity_id: { type: Number }
    , entity_name: { type: String }
})

var entity_synonym_variantsSchema = new Schema({
    entity_id: { type: Number }
    , synonym_id: { type: Number }
    , synonym_variant_id: { type: Number }
    , synonym_value: { type: String }
    , synonym_reference: { type: String }
})

var expression_parametersSchema = new Schema({
    expression_id: { type: Number }
    , parameter_start: { type: Number }
    , parameter_end: { type: Number }
    , entity_id: { type: Number }
    , parameter_id: { type: Number }
    , intent_id: { type: Number }
    , parameter_value: { type: String }
    , entity_name: { type: String }
});

var expressionsSchema = new Schema({
    intent_id: { type: Number }
    , expression_id: { type: Number }
    , expression_text: { type: String }
});

var intent_usage_by_daySchema = new Schema({
    count: { type: Number }
    , to_char: { type: String }
});

var intent_usage_totalSchema = new Schema({
    count: { type: Number }
});

var intentsSchema = new Schema({
    agent_id: { type: Number }
    , intent_id: { type: Number }
    , intent_name: { type: String }
});

var nlu_logSchema = new Schema({
    log_id: { type: Number }
    , ip_address: { type: String }
    , query: { type: String }
    , event_data: { type: String }
    , event_type: { type: String }
    , timestamp: { type: Date, default: Date.now }
});

var parametersSchema = new Schema({
    expression_id: { type: Number }
    , parameter_start: { type: Number }
    , parameter_end: { type: Number }
    , entity_id: { type: Number }
    , parameter_id: { type: Number }
    , parameter_value: { type: String }
});

var request_usage_totalSchema = new Schema({
    count: { type: Number }
});

var response_typeSchema = new Schema({
    response_type_id: { type: Number }
    , response_type_text: { type: String }
});

var synonym_variantSchema = new Schema({
    synonym_variant_id: { type: Number }
    , synonym_id: { type: Number }
    , synonym_value: { type: String }
});

var synonymsSchema = new Schema({
    synonym_id: { type: Number }
    , entity_id: { type: Number }
    , synonym_reference: { type: String }
});

var unique_intent_entitiesSchema = new Schema({
    count: { type: Number }
    , entity_name: { type: String }
});

agentsSchema.plugin(autoIncrement.plugin, { model: 'agents', field: 'agent_id' });
//agentsSchema.plugin(timestamps);
agentsSchema.plugin(mongoosePaginate);

entitiesSchema.plugin(autoIncrement.plugin, { model: 'entities', field: 'entity_id' });
entitiesSchema.plugin(mongoosePaginate);

expressionsSchema.plugin(autoIncrement.plugin, { model: 'expressions', field: 'expression_id' });
expressionsSchema.plugin(mongoosePaginate);

intentsSchema.plugin(autoIncrement.plugin, { model: 'intents', field: 'intent_id' });
intentsSchema.plugin(mongoosePaginate);

nlu_logSchema.plugin(autoIncrement.plugin, { model: 'nlu_log', field: 'log_id' });
nlu_logSchema.plugin(mongoosePaginate);

parametersSchema.plugin(autoIncrement.plugin, { model: 'parameters', field: 'parameter_id' });
parametersSchema.plugin(mongoosePaginate);

response_typeSchema.plugin(autoIncrement.plugin, { model: 'response_type', field: 'response_type_id' });
response_typeSchema.plugin(mongoosePaginate);

synonym_variantSchema.plugin(autoIncrement.plugin, { model: 'synonym_variant', field: 'synonym_variant_id' });
synonym_variantSchema.plugin(mongoosePaginate);

synonymsSchema.plugin(autoIncrement.plugin, { model: 'synonyms', field: 'synonym_id' });
synonymsSchema.plugin(mongoosePaginate);

var agents = mongoose.model('agents', agentsSchema);
var entities = mongoose.model('entities', entitiesSchema);
var entity_synonym_variants = mongoose.model('entity_synonym_variants', entity_synonym_variantsSchema);
var expression_parameters = mongoose.model('expression_parameters', expression_parametersSchema);
var expressions = mongoose.model('expressions', expressionsSchema);
var intent_usage_by_day = mongoose.model('intent_usage_by_day', intent_usage_by_daySchema);
var intent_usage_total = mongoose.model('intent_usage_total', intent_usage_totalSchema);
var intents = mongoose.model('intents', intentsSchema);
var nlu_log = mongoose.model('nlu_log', nlu_logSchema);
var parameters = mongoose.model('parameters', parametersSchema);
var request_usage_total = mongoose.model('request_usage_total', request_usage_totalSchema);
var response_type = mongoose.model('response_type', response_typeSchema);
var synonym_variant = mongoose.model('synonym_variant', synonym_variantSchema);
var synonyms = mongoose.model('synonyms', synonymsSchema);
var unique_intent_entities = mongoose.model('unique_intent_entities', unique_intent_entitiesSchema);

module.exports = {
    agents: agents,
    entities: entities,
    entity_synonym_variants: entity_synonym_variants,
    expression_parameters: expression_parameters,
    expressions: expressions,
    intent_usage_by_day: intent_usage_by_day,
    intent_usage_total: intent_usage_total,
    intents: intents,
    nlu_log: nlu_log,
    parameters: parameters,
    request_usage_total: request_usage_total,
    response_type: response_type,
    synonym_variant: synonym_variant,
    synonyms: synonyms,
    unique_intent_entities: unique_intent_entities
};