const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');

const workshopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a name for the workshop'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Describe the workshop.']
    },
    price: {
        type: Number,
        required: [true, 'Price the workshop']
    },
    venue: {
        type: String,
        required: [true, 'Provide a venue for this workshop']
    },
    date:{
        type: Date
    },
    DateOfCreation: {
        type: Date,
        default: Date.now,
    }
});


workshopSchema.plugin(timezone, { paths: ['DateofCreation.default'] });
const Workshop = mongoose.model('Workshop', workshopSchema);
module.exports = Workshop;