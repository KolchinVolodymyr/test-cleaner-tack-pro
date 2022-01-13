const {Schema, model} = require('mongoose')

const worksitesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    clientID: {
        type: String
    },
    job: {
        items: [
            {
                JobId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Job',
                    required: true
                }
            }
        ]
    }
})
worksitesSchema.methods.addToJobs = function(Job) {
    const items = [...this.job.items];
    const idx = items.findIndex(c => {
        return c.JobId.toString() === Job._id.toString();
    })
    if (idx >= 0) {
        // items[idx].count = items[idx].count + 1;
    } else {
        items.push({
            JobId: Job._id
        })
    }

    this.job = {items};
    return this.save();
}

worksitesSchema.methods.deleteJobs = function(Job) {
    const items = [...this.job.items];

    let newItems = items.filter(function(c) {
        return c.JobId.toString() !== Job._id.toString();;
    });

    this.job = {items: newItems};
    return this.save();
}
module.exports = model('Worksites', worksitesSchema)