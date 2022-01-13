const {Schema, model} = require('mongoose');

const equipmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    storageLocation: {
        type: String,
        required: true
    },
    usageFee: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = model('Equipment', equipmentSchema)