const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required: true
    },
    phone_number : {
        type : Number,
        required: true, 
        unique: true
    }
});

const person = mongoose.model('person', personSchema);
module.exports = person;