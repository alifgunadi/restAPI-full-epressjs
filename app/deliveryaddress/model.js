const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema({
    nama :{
        type: String,
        maxlength: [255, 'Panjang maksimal alamat 255 karakter'],
        required: [true, 'Nama alamat harus diisi']
    },
    kelurahan: {
        type: String,
        maxlength: [255, 'Panjang maksimal kelurahan 255 karakter'],
        required: [true, 'Nama kelurahan harus diisi']
    },
    kecamatan: {
        type: String,
        maxlength: [255, 'Panjang maksimal kalimat 255 karakter'],
        required: [true, 'Kecamatan harus diisi']
    },
    kabupaten: {
        type: String,
        maxlength: [255, 'Panjang maksimal kabupaten 255 karakter'],
        required: [true, 'Kabupaten harus diisi']
    },
    kota: {
        type: String,
        maxlength: [255, 'Panjang maksimal kota 255 karakter'],
        required: [true, 'Kota harus diisi']
    },
    provinsi: {
        type: String,
        maxlength: [255, 'Panjang maksimal provinsi 255 karakter'],
        required: [true, 'Provinsi harus diisi'],
    },
    detail: {
        type: String,
        maxlength: [1000, 'Panjang maksimal detail 1000 karakter'],
        required: [true, 'Detail harus diisi'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

}, {timestamps: true});

const DeliveryAddress = model('DeliveryAddress', deliveryAddressSchema);
module.exports = DeliveryAddress