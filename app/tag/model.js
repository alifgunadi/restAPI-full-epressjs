const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const tagSchema = Schema({
    name: {
        type: String,
        minlength: [3, `Minimum tag name should be 3 characters`],
        maxlength: [10, `Maximum tag name should be 10 characters`],
        required: [true, `Tag name does not exist`]
    },
}, {timestamps: true});

const Tag = model('Tag', tagSchema);
module.exports = Tag;