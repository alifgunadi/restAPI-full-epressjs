const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
    nama: {
        type: String,
        minlength: [5, "Panjang nama makanan minimal 5 karakter"],
        required: [true, "Nama makanan wajib diisi"]
    },
    qty: {
        type: Number,
        min: [1, "Panjang karakter kuantitas minimal 1"],
        required: [true, "Kuantitas harus diisi"]
    },
    price: {
        type: Number,
        required: [true, 'Harga harus diisi']
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

const OrderItems = model('OrderItem', orderItemSchema);
module.exports = OrderItems;