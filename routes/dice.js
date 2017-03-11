var express = require('express');
var router = express.Router();
/*var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser);*/
/* GET dice.js roller page. */
router.get('/', function(req, res, next) {

    console.log('GET: ' + req.query.roll);
    console.log('POST: ' + req.body.roll);
    res.render('dice', { title: 'Dice'/*,
                         roll: req.body.roll*/});
});

module.exports = router;
