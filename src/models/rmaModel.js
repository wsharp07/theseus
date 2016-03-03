var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RmaSchema = new Schema({
  rmaNumber:  String,
  serialNumber: String,
  product: String,
  comments: [{ body: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rma',RmaSchema);