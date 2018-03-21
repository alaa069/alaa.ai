const express = require('express');
const router = express.Router();
const UsersCTRL = require('../controller/user');
const fs   = require('fs');
const validator = require('validator');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

router.get("/", function(req, res){
    res.status(200).json({message: 'hello', error: false})
})

router.get("/user", function(req, res){
    var getUser = UsersCTRL.FindAll()
    getUser.then(function(result) {
        res.status(200).json({message: result, error: false})
    }, function(err) {
        res.status(200).json({message: err, error: true})
    })    
})

router.post("/user", function(req, res){
    var user = req.body.user;
    var setUser = {};
    setUser.FirstName = user.FirstName ? user.FirstName : '';
    setUser.LastName = user.LastName ? user.LastName : '';
    setUser.FullName = (user.FirstName && user.LastName) ? user.FirstName + " " + user.LastName : '';
    if(user.Username) setUser.Username = user.Username;
    else {res.status(200).json({message: 'Username is required', error: false}); return;}
    if(user.Mail) setUser.Mail = user.Mail; else {res.status(200).json({message: 'Mail is required', error: false}); return;}
    if(user.Password) setUser.Password = user.Password; else {res.status(200).json({message: 'Password is required', error: false}); return;}
    var status = UsersCTRL.Create(setUser);
    status.then(function(result) {
        res.status(200).json({message: 'User has added', error: false})
    }, function(err) {
        res.status(200).json({message: { code: err.code, index: err.index, errmsg: err.errmsg + 'Username or Mail exist in our Database'}, error: true})
    }) 
})

router.put("/user", function(req, res){
    var user = req.body.user;
    var status = UsersCTRL.UpdateOneByUsername(user.Username, user);
    status.then(function(result) {
        res.status(200).json({message: 'User has updated', error: false})
    }, function(err) {
        res.status(200).json({message: { code: err.code, index: err.index, errmsg: err}, error: true})
    }) 
})

router.delete("/user", function(req, res){
    var user = req.body.user;
    var status = UsersCTRL.DeleteOneByUsername(user.Username);
    status.then(function(result) {
        res.status(200).json({message: 'User has deleted', error: false})
    }, function(err) {
        res.status(200).json({message: { code: err.code, index: err.index, errmsg: err}, error: true})
    }) 
})

module.exports = router;