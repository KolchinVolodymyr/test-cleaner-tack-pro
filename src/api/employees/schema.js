const {Schema, model} = require('mongoose');

const employeesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = model('Employees', employeesSchema)