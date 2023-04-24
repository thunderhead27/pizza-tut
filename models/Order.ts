import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    streetAddress: String,
    city: String,
    state: String,
    zipCode: Number
})

const CartItem = new mongoose.Schema({
    cartId: String,
    image: String,
    totalQuantity: Number,
    priceEach: Number,
    id: Number,
    name: String,
    points: Number,
    flavor: String,
    dressing: String,
    pizzaSize: String,
    toppings: [String]
})

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    method: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    itemsPrice: {
        type: Number
    },
    taxPrice: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    deliveryAddress: {
        type: AddressSchema,
    },
    cartItems: {
        type: [CartItem],
        required: true
    },
    myStore: {
        name: {
            type: String,
        },
        streetAddress: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: Number
        }
    },
    paidAt: { type: Date },
}, {
    timestamps: true,
})

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;