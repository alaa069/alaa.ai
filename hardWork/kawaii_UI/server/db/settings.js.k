const db = require('./dbk').settings

function getSingleSetting(req, res, next) {
  console.log("settings.getSingleSetting");
  var settingName = parseInt(req.params.setting_name);
  db.findOne({setting_name: settingName}, function(err,doc){
      if(err) return next(err);
      res.status(200).json(doc);
  })
}

function getSettings(req, res, next){
    console.log("settings.getSettings");
    db.find({},function(err, doc){
        if(err)return next(err);
        res.status(200).json(doc);
    })
}

function updateSetting(req, res, next) {
    console.log("settings.updateSetting");
    var settingName = parseInt(req.params.setting_name);
    var settingValue = parseInt(req.params.setting_value);
    db.findOne({ setting_name: settingName},function(err, doc){
        if(err) return next(err);
        doc.setting_value = settingValue
        doc.setting_name = settingName
        doc.save(function (err, fact) {
            if (err) {
                return next(err);
            } else {
                res.status(200).json({ status: 'success', message: 'Updated setting' });
            }
        })
    })
}

module.exports = {
  getSingleSetting: getSingleSetting,
  getSettings: getSettings,
  updateSetting: updateSetting
};