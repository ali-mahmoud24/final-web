const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tourSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Tour', tourSchema);