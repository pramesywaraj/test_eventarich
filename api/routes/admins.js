const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
// const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
const Category = require('../models/category');
const User = require('../models/user');
const Event = require('../models/event');
// const jwt = require('jsonwebtoken');


//GET ORDERS
router.get('/orders', (req, res, next) => {
    Order.find()
        // .select('category date budget address description _id')
        .populate('category', 'name')
        .populate('userId', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        date_created: doc.date_created,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        status: doc.status,
                        userId: doc.userId,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/admins/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//GET EVENTS
router.get('/events', (req, res, next) => {
    Event.find()
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs.map(doc => {
                    return {
                        title: doc.title,
                        date_create: doc.date_create,
                        date_event: doc.date_event,
                        description: doc.description,
                        event_image: doc.event_image,
                        _id: doc._id,
                        // province: doc.province,
                        city: doc.city,
                        // address: doc.address,
                        // link: doc.link,
                        userId: doc.userId,
                        categoryevent: doc.categoryevent,
                        status: doc.status,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/events/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;
