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

//Routesnya /products
router.post('/', checkAuth, upload.single('event_image'), (req, res, next) => {
    console.log(req.file);
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "bismillah");

    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        date_create: date_create,
        date_event: req.body.date,
        description: req.body.description,
        // event_image: req.file.path,
        // province: req.body.province,
        city: req.body.city,
        // address: req.body.address,
        // link: req.body.link,
        userId: decode.userId,
        categoryevent: req.body.categoryevent

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
                    event_image: result.event_image,
                    _id: result._id,
                    // province: result.province,
                    city: result.city,
                    // address: result.address,
                    // link: result.link,
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

router.get('/', (req, res, next) => {
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


router.post('/search', (req, res, next) => {
    var title = req.body.title;
    Event.find({title : title})
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

router.patch('/reject/:eventId', checkAuth, (req, res, next) => {
    const id = req.params.eventId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Event.update({ _id: id }, { $set: {status : "Rejected"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Rejected",
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

router.delete('/delete/:eventId', checkAuth, (req, res, next) => {
    const id = req.params.eventId;
    Event.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
