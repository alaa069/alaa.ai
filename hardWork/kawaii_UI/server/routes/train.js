var express = require('express');
var router = express.Router();

var train = require('../ctrl/train');

router.post('/', train.settrain);