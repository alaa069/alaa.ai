var fs          = require("fs");
var request     = require("request");
var jsonfile    = require('jsonfile')
const path      = require("path");
const env       = process.env.NODE_ENV || "development";
const config    = require(path.join(__dirname, '/../config', 'config.json'))[env];

function settrain(req, res, next) {
    var names = req.query.name.split("_");
    var name = names[0];
    var obj = req.body;
    var file = __dirname + '/' + name + '.json'

    jsonfile.writeFile(file, obj, { spaces: 2 }, function (err) {
        if (err) console.error(err)

        var options = {
            url: config.kawaiiserver + '/train?name=' + name,
            method: 'POST',
            body: fs.createReadStream(file)
        };

        function callback(error, response, body) {
            console.log(body);
            setTimeout(function () {
                fs.unlinkSync(file);
            }, 3000)
        }

        request(options, callback);
    })
}

function removetrain(req, res, next) {
    var path = req.query.path;
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = {
    settrain: settrain,
    removetrain: removetrain
};
