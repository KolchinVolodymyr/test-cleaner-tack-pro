const {Schema, model} = require('mongoose');

const jobSchema = new Schema({
    worksiteID: {
        type: String,
        required: true
    },
    employeesID: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    hazardousMaterials: {
        type: String,
        required: true
    },
    serviceFee: {
        type: Number,
        required: true
    },
    additionalEquipment: {
       type: Array,
       required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
})

module.exports = model('Job', jobSchema)