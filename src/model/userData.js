// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.uq40y.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

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