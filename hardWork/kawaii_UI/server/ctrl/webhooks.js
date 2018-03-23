const WebHooks = require('node-webhooks')

function index(req, res, next) {
    console.log("webhooks.index", req.body)
    next()
    
    
    var webHooks = new WebHooks({
        db: './webHooksDB.json' // json file that store webhook URLs 
        //httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes 
    })
     
    // sync instantation - add a new webhook called 'shortname1' 
    webHooks.add('web', 'http://localhost:3000/web').then(function(){
        // done 
        console.log('done')
    }).catch(function(err){
        console.log(err)
    })
}

module.exports = {
    index: index
};