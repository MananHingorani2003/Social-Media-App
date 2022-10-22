const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model ("Post", postSchema);