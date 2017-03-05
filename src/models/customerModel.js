var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  customerName:  String,
  customerKey: String,
  status: {
  	type: String,
  	enum: ['Active', 'Archived'],
  	default: 'Active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer',CustomerSchema);