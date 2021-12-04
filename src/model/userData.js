// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/library');

// schema definition
const schema = mongoose.Schema;

const userSchema= new schema({
    username: String,
    email: String,
    password: String,
    phoneno: String
});

// model
var userdata = mongoose.model('userdata',userSchema);

module.exports = userdata;