import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    type: String,
    coordinates: [Number]
})

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: Number
})

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 40
    },
    location: {
        type: LocationSchema
    },
    address: {
        type: AddressSchema
    }
})

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);