var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    async = require('async');

var Customer = require('../models/customerModel');
var PaginationParser = require('../helpers/PaginationParser');
var logger = require('../../logger');

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

// [/customers]
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
        

        Customer
            .find()
            .skip(skip)
            .limit(take)
            .sort(sortString)
            .exec(function(err, customers) {
                Customer.count().exec(function(err, count) {
                    if (err) {
                        logger.error(err);
                        res.status(500).send(err);
                        return;
                    }
                    var result = {
                        total: count,
                        data: customers
                    };

                    res.send(result);
                })
            });
    })
    .post(function(req, res) {
        var customer = new Customer(req.body);
        
        customer.save(function(err, data) {
            if (err) {
                res.status(500).send("An error occurred while saving the Customer");
            }
            res.status(200).send(data);
        });
    });

module.exports = router;