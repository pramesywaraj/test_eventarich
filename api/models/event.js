const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    // butuh diliat enaknya pake types object atau increment number aja
    _id: mongoose.Schema.Types.ObjectId,

    //userId: { type: String, ref: 'User', required: true },

    title: {
        type: String,
        max: 60,
        required: true
    },

    date_create: {
        type: Date,
        required: true
    },

    date_event: {
        type: Date, 
        required: true
    },

    description: {
        type: String
    },

    event_image: {
      type: String,
      // required: true
    },

    city: {
      type: String,
      required: true
    },

    // link: {
    //   type: String,
    //   required: true
    // },
    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },

    status: {
      type: String,
      default: "waiting admin's confirmation.."
    },

    categoryevent: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Categoryevent', required: true
    }

});

module.exports = mongoose.model('Event', EventSchema);
