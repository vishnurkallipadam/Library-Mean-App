// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/library');

// schema definition
const schema = mongoose.Schema;

const bookSchema= new schema({
    title: String,
    author: String,
    genere: String,
    image: String
});

// model
var bookdata = mongoose.model('bookdata',bookSchema);

module.exports = bookdata;