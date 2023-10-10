const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "you forgot to enter your name"],
        maxlength: [20, "name is too long"],
        trim: true
    },
    lastname: { type: String, required: true, maxlength: [20, "name is too long"], trim: true },
    username: { type: String, required: true, maxlength: [20, "name is too long"], trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: [8, "password should be atleast 8 character"] },
    dob: { type: Date },


})

module.exports = mongoose.model('User', userSchema)






