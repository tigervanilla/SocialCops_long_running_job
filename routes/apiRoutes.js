var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload = multer({ dest: './public/csv/' });

var apiCtrl=require('./../controllers/apiCtrl');

router.get('/home', apiCtrl.showHome);      //homepage

router.post('/upload',upload.single('myfile'),apiCtrl.uploadFile); //upload data file
router.get('/dashboard/overview',apiCtrl.dataOverviewForm); //form to get start and end dates
router.post('/dashboard/overview',apiCtrl.getDataOverview); //data rows within start and end dates
router.post('/dashboard/sales-delete',apiCtrl.deleteSalesRecordByCsvName);  //delete sales data using csv name
router.post('/team/bulk-team-upload',upload.single('myTeamsFile'),apiCtrl.uploadBulkTeamFile); //upload teams.csv
router.post('/team/bulk-create',apiCtrl.createBulkTeam); //create bulk teams using csv file
router.get('/dashboard/teams',apiCtrl.getAllTeams); //sends rows of all teams
router.get('/dashboard/teams/:teamId',apiCtrl.getTeamById); //sends a particular team

module.exports = router;
