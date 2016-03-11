var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var Rma = require('../models/rmaModel');
var RmaHelper = require('../helpers/RmaHelper');
var logger = require('../../logger');
var PaginationParser = require('../helpers/PaginationParser');

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

// [/rmas]
router.route('/')
    .get(function(req, res, next) {
        logger.debug(req.query);
        var queryParser = new PaginationParser(req.query);

        Rma
            .find()
            .skip(queryParser.recordsToSkip)
            .limit(queryParser.pageSize)
            .sort(queryParser.getSortString())
            .exec(function(err, rmas) {
                Rma.count().exec(function(err, count) {
                    if (err) {
                        logger.error(err);
                        res.status(500).send(err);
                        return;
                    }
                    var result = {
                        total_count: count,
                        data: rmas
                    };

                    res.send(result);
                })
            });
    })
    .post(function(req, res) {
        var query = Rma.findOne({});
        query.sort({ _id: -1 });
        query.select('rmaNumber');
        query.exec(function(err, data) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            var rma = new Rma();
            if (data) {
                rma.rmaNumber = RmaHelper.getNextRmaNumber(data.rmaNumber);
            }
            else {
                rma.rmaNumber = RmaHelper.getNextRmaNumber();
            }
            rma.product = req.body.product;
            rma.serialNumber = req.body.serialNumber;
            rma.comments = req.body.comments;
            rma.save(function(err, data) {
                if (err) {
                    res.status(500).send("An error occurred while saving the RMA");
                }
                res.status(200).send(data);
            });
        });
    });

module.exports = router;