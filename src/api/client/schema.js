const {Schema, model} = require('mongoose');
const {string} = require("joi");

const clientSchema = new Schema({
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
    contactPerson: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    worksites: {
        items: [
            {
                WorksitesId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Worksites',
                    required: true
                },
                WorksitesItem: {
                    type: Object
                }
            }
        ]
    }

})
clientSchema.methods.addToWorksites = function(Worksites) {
    const items = [...this.worksites.items];
    const idx = items.findIndex(c => {
        return c.WorksitesId.toString() === Worksites._id.toString();
    })
    if (idx >= 0) {
        // items[idx].count = items[idx].count + 1;
    } else {
        items.push({
            WorksitesId: Worksites._id,
            WorksitesItem: Worksites
        })
    }

    this.worksites = {items};
    return this.save();
}
clientSchema.methods.deleteWorksites = function(Worksites) {
    const items = [...this.worksites.items];

    let newItems = items.filter(function(c) {
        return c.WorksitesId.toString() !== Worksites._id.toString();;
    });

    this.worksites = {items: newItems};
    return this.save();
}

module.exports = model('Client', clientSchema)