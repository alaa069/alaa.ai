const express = require('express');
const router = express.Router();

router.get("/", function(req, res){
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render("index")
    }
})

router.get("/dashboard", requireLogin, function(req, res){
    res.render("dashboard")
})

router.get("/template", requireLogin, function(req, res){
    res.render("template")
})

router.get("/template/icons", function(req, res){
    res.render("template/icons")
})

router.get("/template/map", function(req, res){
    res.render("template/map")
})

router.get("/template/notifications", function(req, res){
    res.render("template/notifications")
})

router.get("/template/tables", function(req, res){
    res.render("template/tables")
})

router.get("/template/typography", function(req, res){
    res.render("template/typography")
})

router.get("/template/upgrade", function(req, res){
    res.render("template/upgrade")
})

router.get("/template/user", function(req, res){
    res.render("template/user")
})

function requireLogin (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        req.session.user.PasswordView = '';
        next();
    }
};

module.exports = router;