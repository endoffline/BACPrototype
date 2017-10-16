var express = require('express');
var router = express.Router();
var diceParser = require('./dice_parser.js');
var parse = diceParser.parse;
var diceResultToString = diceParser.diceResultToString;

/* GET dice page. */
router.get('/', function(req, res, next) {
    res.render('dice', { title: 'Dice-Roller' });
});

/* POST dice response */
router.post('/', function(req, res, next) {
    var result = parse(req.body.rollMsg);

    // send result JSON when AJAX-Request
    // else render the result within the whole website
    if (req.xhr || req.accepts('json,html')==='json') {
        res.json({ rollResult: result });
        console.log("AJAX");
    } else {
        var resultString = diceResultToString(result);
        res.render('dice', { title: 'Dice-Roller',
            rollResult: resultString
        });
        console.log("POST");
    }
});

module.exports = router;
