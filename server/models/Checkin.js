// const mongoose = require('mongoose');

// const checkinSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',  // Assuming you have a User model
//     required: true
//   },
//   latitude: {
//     type: Number,
//     required: true
//   },
//   longitude: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Checkin = mongoose.model('Checkin', checkinSchema);
// module.exports = Checkin;

const mongoose = require("mongoose");

const checkinRecordSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
});

const checkinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Ensure this matches the model name exactly
        required: true
    },
    checkins: [checkinRecordSchema]  // Array of check-in records
});

module.exports = mongoose.model("Checkin", checkinSchema);
