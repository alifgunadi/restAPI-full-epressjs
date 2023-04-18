const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const invoiceSchema = Schema({
    sub_total: {
        type: Number,
        required: [true, 'sub_total wajib diisi'],
    },
    delivery_fee: {
        type: Number,
        required: [true, 'delivery_fee wajib diisi']
    },
    delivery_address: {
        provinsi: {type: String, required: [true, 'Provinsi wajib diisi']},
        kabupaten: {type: String, required: [true, 'Kabupaten wajib diisi']},
        kecamatan: {type: String, required: [true, 'Kecamatan wajib diisi']},
        kelurahan: {type: String, required: [true, 'Kelurahan wajib diisi']},
        detail: {type: String},
    },
    total: {
        type: Number,
        required: [true, 'Total wajib tercantum']
    },
    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

const Invoice = model('Invoice', invoiceSchema);
module.exports = Invoice;