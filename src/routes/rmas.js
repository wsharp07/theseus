var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    redis = require('redis');
    async = require('async');

var Rma = require('../models/rmaModel');
var RmaHelper = require('../helpers/RmaHelper');
var logger = require('../../logger');
var PaginationParser = require('../helpers/PaginationParser');
var client = redis.createClient(32769,'192.168.99.100');

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

        var take = parseInt(req.query.take);
        var skip = parseInt(req.query.skip);
        var sortString = "";
        if(req.query.sort) {
            var sortBy = req.query.sort[0].field;
            var sortDir = req.query.sort[0].dir;
            var sortString = (sortDir === 'asc' ? '' : '-') + sortBy; 
        }
        

        Rma
            .find()
            .skip(skip)
            .limit(take)
            .sort(sortString)
            .exec(function(err, rmas) {
                Rma.count().exec(function(err, count) {
                    if (err) {
                        logger.error(err);
                        res.status(500).send(err);
                        return;
                    }
                    var result = {
                        total: count,
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

            var rma = new Rma(req.body);
            if (data) {
                rma.rmaNumber = RmaHelper.getNextRmaNumber(data.rmaNumber);
            }
            else {
                rma.rmaNumber = RmaHelper.getNextRmaNumber();
            }

            rma.save(function(err, data) {
                if (err) {
                    res.status(500).send("An error occurred while saving the RMA");
                }
                res.status(200).send(data);
            });
        });
    })
    .put(function(req,res) {
        var id = req.body._id;
        var comments = req.body.comments;
        var serialNumber = req.body.serialNumber;
        var product = req.body.product;
        var status = req.body.status;

        Rma.findById(id, function(err, rma) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            rma.comments = comments;
            rma.serialNumber = serialNumber;
            rma.product = product;
            rma.status = status;

            rma.save(function(err, data) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send(data);
            });      
        });
    });

module.exports = router;