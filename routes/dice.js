var express = require('express');
var router = express.Router();

/* GET dice page. */
router.get('/', function(req, res, next) {
    res.render('dice', { title: 'Dice' });
});

router.post('/', function(req, res, next) {
    res.render('dice', { title: 'Dice',
        rollResult: req.body.rollMsg
    });
});

module.exports = router;
