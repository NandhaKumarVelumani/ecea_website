const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');
const slugify = require('slugify');

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
    slug: String,
    price: {
        type: Number,
        required: [true, 'Price the workshop']
    },
    venue: {
        type: String,
        required: [true, 'Provide a venue for this workshop']
    },
    eventDate:{
        type: Date
    },
    poster:{
        type: String
    },
    DateOfCreation: {
        type: Date,
        default: Date.now,
    }
});
//workshopSchema.index({ eventDate: 1 });

workshopSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
workshopSchema.plugin(timezone, { paths: ['DateofCreation.default'] });
const Workshop = mongoose.model('Workshop', workshopSchema);
module.exports = Workshop;