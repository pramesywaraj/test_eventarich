// Ini buat referensi aja, ada buat upload filenya


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkauth');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


const Event = require('../models/event');
const Categoryevent = require('../models/categoryevent');
// var date_create = Date.now();
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = ((today.getHours()+7)%24) + ":" + today.getMinutes() + ":" + today.getSeconds();
var date_create = date+' '+time;

//var name = Jwts.parser().setSigningKey("bismillah").parseClaimsJws("base64EncodedJwtHere").getBody().get("name", String.class);

//Post Events
router.post('/', checkAuth, (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "bismillah");

    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        date_create: date_create,
        date_event: req.body.date_event,
        description: req.body.description,
        city: req.body.city,
        userId: decode.userId,
        categoryevent: req.body.categoryevent,
        event_image_path : req.body.event_image_path,        
    });

    event
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Event successfully created',
                createdEvent: {
                    title: result.title,
                    date_create: result.date_create,
                    date_event: result.date_event,
                    description: result.description,
                    event_image_path : result.event_image_path,                
                    _id: result._id,
                    city: result.city,
                    userId: result.userId,
                    categoryevent: result.categoryevent,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/events/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
});

//Get Event By UserId
router.get('/user', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const userId = decode.userId;
    Event.find({userId : userId})
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        date_create: doc.date_create,
                        date_event: doc.date_event,
                        description: doc.description,
                        event_image_path : doc.event_image_path,
                        city: doc.city,
                        categoryevent: doc.categoryevent,
                        likes  : doc.likes,
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


//Get All Event
router.get('/', (req, res, next) => {
    Event.find({status : "Accept"})
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
                        event_image_path: doc.event_image_path,
                        _id: doc._id,
                        city: doc.city,
                        userId: doc.userId,
                        categoryevent: doc.categoryevent,
                        likes : doc.likes,
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

// Get by EventId
router.get('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    Event.findById(id)
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .select('')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json({
                    event: doc,
                    request: {
                        type: "GET",
                        desc: "Get all events",
                        url: "http://localhost:3000/events"
                    }
                });
            } else {
                res.status(404).json({message: "Format EventID tidak valid"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err});
        });
});

router.patch('/like/:eventId', checkAuth, (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
	const decode = jwt.verify(token, "bismillah");
    const userId = decode.userId;
    const id = req.params.eventId;
    Event.update({ _id: id }, { $inc: {likes : 1} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Likes updated",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/events" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/edit/:eventId', checkAuth, (req, res, next) => {
    const id = req.params.eventId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Event.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event updated",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/events" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/accept/:eventId', checkAuth, (req, res, next) => {
    const id = req.params.eventId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Event.update({ _id: id }, { $set: {status : "Accept"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Accepted",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/events" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/delete/:eventId', checkAuth, (req, res, next) => {
    const id = req.params.eventId;
    Event.update({ _id: id }, { $set: {status : "0"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Deleted",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/events" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
