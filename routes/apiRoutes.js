var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload = multer({ dest: './public/csv/' });

var apiCtrl=require('./../controllers/apiCtrl');

router.get('/home', apiCtrl.showHome);

router.post('/upload',upload.single('myfile'),apiCtrl.uploadFile);
router.get('/dashboard/overview',apiCtrl.dataOverviewForm);
router.post('/dashboard/overview',apiCtrl.getDataOverview);
router.post('/dashboard/sales-delete',apiCtrl.deleteSalesRecordByCsvName);
router.post('/team/bulk-team-upload',upload.single('myTeamsFile'),apiCtrl.uploadBulkTeamFile);
router.post('/team/bulk-create',apiCtrl.createBulkTeam);
router.get('/dashboard/teams',apiCtrl.getAllTeams);
router.get('/dashboard/teams/:teamId',apiCtrl.getTeamById);

module.exports = router;
