// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/library');

// schema definition
const schema = mongoose.Schema;

const authorSchema= new schema({
    name: String,
    works: String,
    penname: String,
    image: String
});

// model
var authordata = mongoose.model('authordata',authorSchema);

module.exports = authordata;