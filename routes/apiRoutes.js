var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload = multer({ dest: './public/csv/' });

var apiCtrl=require('./../controllers/apiCtrl');

router.get('/home', apiCtrl.showHome);
router.post('/upload',upload.single('myfile'),apiCtrl.uploadFile);
router.get('/dashboard/sales/:startDate/:endDate',apiCtrl.getSalesData);

module.exports = router;
