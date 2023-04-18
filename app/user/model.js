const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcrypt');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = Schema({
    full_name: {
        type: String,
        required: [true, 'Nama user harus diisi']
    },
    customer_id: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi']
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String],
}, {timestamps: true});

userSchema.path('email').validate(function (value) {
    const EMAIL_RE = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid`);

userSchema.path('email').validate(async function (value) {
    try {
        const count = await this.model('User').count({email: value});
        return !count;
    } catch (error) {
        next(error)};
    next(error)
}, attr => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
        this.password = bcrypt.hashSync(this.password, HASH_ROUND);
        next();
});

// userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

const Users = model('User', userSchema);
module.exports = Users;
