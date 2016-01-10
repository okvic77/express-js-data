var mongoose = require('mongoose'), Schema = mongoose.Schema;


var db = module.exports = {};


var Data = new Schema({ name: String }, {strict:false});


db.data = mongoose.model('Data', Data);
