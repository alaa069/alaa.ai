const nlu_log = require('./dbk').nlu_log
const intent_usage_by_day = require('./dbk').intent_usage_by_day
const intent_usage_total = require('./dbk').intent_usage_total
const request_usage_total = require('./dbk').request_usage_total
const db = require('./db')

module.exports = {
    getLogs: getLogs,
    getRequestUsageTotal: getRequestUsageTotal,
    getIntentUsageTotal: getIntentUsageTotal,
    getIntentUsageByDay: getIntentUsageByDay,
    getAvgIntentUsageByDay: getAvgIntentUsageByDay
};

function getLogs(req, res, next) {
    var query = req.params.query;
    nlu_log.find({event_type: query}).sort({ timestamp: 'desc' }).limit(100).exec(function (err, docs) {
        if (err) return next(err);
        res.status(200).json(doc);
    });
}

function getAvgIntentUsageByDay(req, res, next) {
    db.any('select round(avg(count)) as avg from intent_usage_by_day')
        .then(function (data) {
            res.status(200)
                .json(data);
        })
        .catch(function (err) {
            return next(err);
        });
}

function getIntentUsageByDay(req, res, next) {
    intent_usage_by_day.find({}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getIntentUsageTotal(req, res, next) {
    intent_usage_total.find({}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}

function getRequestUsageTotal(req, res, next) {
    request_usage_total.find({}, function (err, doc) {
        if (err) return next(err);
        res.status(200).json(doc);
    })
}
