const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require ('passport-local-mongoose');

const userSchema = new Schema ({
    username: {
        type: String,
        required: [true, 'Username cannot be blank'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank'],
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty"],
        unique: true

    },
    name: {
        type: String,
        required: [true, "Name can't be empty"],
    }
})

userSchema.plugin (passportLocalMongoose);

module.exports = mongoose.model ("Auth", userSchema);