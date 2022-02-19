const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a name for the event'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Describe the event.']
    },
    price: {
        type: Number,
    },
    venue: {
        type: String,
        required: [true, 'Provide a venue for this event']
    },
    date:{
        type: Date
    },
    typeOfEvent: {
        type: String,
        required: [true, 'Tell the type of the event: tech or nontech'],
        enum: {
            values: ['tech', 'nontech'],
            message: 'The event should be either tech or nontech'
        }
    },
    DateOfCreation: {
        type: Date,
        default: Date.now,
    }
});

eventSchema.plugin(timezone, { paths: ['DateofCreation.default'] });

const Event = mongoose.model('Program', eventSchema);
module.exports = Event;