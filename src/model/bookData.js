// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.uq40y.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

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