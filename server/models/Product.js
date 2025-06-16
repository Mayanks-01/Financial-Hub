const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: String,
  name: String,
  description: String,
  interest_rate: Number,
  limit: Number,
  terms: Object,
  availability: Boolean,
});

module.exports = mongoose.model('Product', productSchema);