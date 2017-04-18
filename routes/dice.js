var express = require('express');
var router = express.Router();
var diceParser = require('./dice_parser.js');
var parse = diceParser.parse;
var diceResultToString = diceParser.diceResultToString;

/* GET dice page. */
router.get('/', function(req, res, next) {
    res.render('dice', { title: 'Dice' });
});

router.post('/', function(req, res, next) {
    var result = parse(req.body.rollMsg);
    var resultString = diceResultToString(result);
    console.log(resultString);
    console.log(result);
    res.render('dice', { title: 'Dice',
        rollResult: resultString
    });
});

module.exports = router;
