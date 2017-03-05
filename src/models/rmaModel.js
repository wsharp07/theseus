var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RmaSchema = new Schema({
  rmaNumber:  String,
  serialNumber: String,
  product: String,
  comments: String,
  status: {
  	type: String,
  	enum: ['Open', 'Closed'],
  	default: 'Open'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rma',RmaSchema);