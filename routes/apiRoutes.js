var express = require('express');
var router = express.Router();
var apiCtrl=require('./../controllers/apiCtrl');

router.get('/home', apiCtrl.showHome);

module.exports = router;
