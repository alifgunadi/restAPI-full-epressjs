const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema({
    
    name: {
        type: String,
        minlength: [3, `Panjang nama minimal 3 karakter`],
        required: [true, "Nama makanan harus diisi"]
    },
    
    description: {
        type: String,
        minlength: [3, `Panjang deskripsi minimal 2 kalimat`],
    },

    price: {
        type: Number,
        default: 0,
    },

    image_url: String,

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },

    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }]

}, {timestamps: true});      // timestamps untuk menambahkan createAt dan updatedAt 

const Products = model('Products', productSchema);
module.exports = Products