import mongoose from "mongoose";

const MyStoreSchema = new mongoose.Schema({
    name: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: Number }
})

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        myStore: { type: MyStoreSchema },
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }],
        points: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
