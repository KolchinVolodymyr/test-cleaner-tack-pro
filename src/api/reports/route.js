'use strict';

// const MODEL_NAME = 'worksites';
const Worksites = require('../worksites/schema');
const Client = require('../client/schema');
const Job = require("../job/schema");
const Employees = require("../employees/schema");

module.exports = [
    {
        method: 'GET',
        path: `/monthlyEarningsReport`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const client = await Client.find();

                const clientWorksites = [];
                const promises = client.map(async (el) => {
                    el.worksites.items.map((index)=>{
                        clientWorksites.push(index);
                    })
                })
                // console.log('clientWorksites', clientWorksites);
                await Promise.all(promises);

                const dataJob = [];
                const promisesClientWorksites = clientWorksites.map(async (el) => {
                    const promisesWorksitesJob = el.WorksitesItem.job.items.map(async (id)=>{
                        const job = await Job.findById(id.JobId);
                        // console.log('id', id);
                        // console.log('job', job);
                        const employees = await Employees.findById(job.employeesID);
                        const worksites = await Worksites.findById(job.worksiteID);
                        const client = await Client.findById(worksites.clientID);
                        // console.log('client', client);
                        // dataJob.push(job);
                        dataJob.push({
                            employees: employees,
                            worksites: worksites,
                            client: client,
                            job: job,
                        })
                    });
                    await Promise.all(promisesWorksitesJob);
                })
                await Promise.all(promisesClientWorksites);

                return h.response({dataJob, client, clientWorksites}).code(200).takeover();
            } catch (e) {
                console.log(e);
            }
        }
    }
]



