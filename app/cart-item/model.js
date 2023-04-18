const mongoose = require('mongoose');
const { model, Schema  } = mongoose;

const cartItemSchema = Schema({
    nama: {
        type: String,
        minlength: [2, "Panjang nama makanan minimal 2 karakter"],
        required: [true, "Nama makanan wajib diisi"]
    },
    qty: {
        type: Number,
        min: [1, "panjang karakter qty minimal 1 angka"],
        required: [true, "qty harus diisi"]
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
    }
});


const CartItem = model('CartItem', cartItemSchema);
module.exports = CartItem