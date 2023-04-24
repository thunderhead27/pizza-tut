import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxLength: 60
    },
    category: {
        type: String,
        required: true,
        maxLength: 60
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: 100
    },
    price: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        maxLength: 60
    },
    points: {
        type: Number
    },
    flavor: {
        type: Array
    },
    dressing: {
        type: Array
    }
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);