var express = require('express');
var router = express.Router();
var handleController = require('../src/controllers/HandleController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/scan-data', handleController.crawlData);


module.exports = router;
