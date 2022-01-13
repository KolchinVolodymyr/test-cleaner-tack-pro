'use strict';

const MODEL_NAME = 'client';
const Client = require('./schema');
const Joi = require("@hapi/joi");
const Worksites = require('../worksites/schema');
const Job = require('../job/schema');
const Employees = require('../employees/schema');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}/list`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            const clients = await Client.find();
            return h.response(clients).code(200).takeover();
        }
    },
    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}/edit`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const client = await Client.findById(request.params.id);
                const clientWorksitesItem = [];
                const promises = client.worksites.items.map(async (el) => {
                    const worksites = await Worksites.findById(el.WorksitesId);
                    clientWorksitesItem.push(worksites);
                })
                await Promise.all(promises);
                return h.response({client, clientWorksitesItem}).code(200).takeover();
            } catch (e) {
                console.log(e);
            }
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).required().error(new Error('Minimum name length 3 characters')),
                    address: Joi.string().min(3).required().error(new Error('Minimum name length 3 characters')),
                    phone: Joi.number().integer().required().error(new Error('Enter the correct phone')),
                    contactPerson: Joi.string().min(3).required().error(new Error('Enter the correct Contact Person')),
                    client: Joi.string().min(3).required().error(new Error('Enter the correct client: corporate or personal')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    return h.response({message: err.output.payload.message}).code(400).takeover();
                }
            },
        },
        handler: async function (request, h) {
            const client = new Client({
                name: request.payload.name,
                address: request.payload.address,
                phone: request.payload.phone,
                contactPerson: request.payload.contactPerson,
                client: request.payload.client,
                status: request.payload.status,
            });

            client.save();
            if (!client) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Client successfully created !!!'}).code(201).takeover();
        }
    },
    {
        method: 'PUT',
        path: `/${MODEL_NAME}/{id}/edit`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).required().error(new Error('Minimum name length 3 characters')),
                    address: Joi.string().min(3).required().error(new Error('Minimum name length 3 characters')),
                    phone: Joi.number().integer().required().error(new Error('Enter the correct phone')),
                    contactPerson: Joi.string().min(3).required().error(new Error('Enter the correct Contact Person')),
                    client: Joi.string().min(3).required().error(new Error('Enter the correct client: corporate or personal')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: async (request, h, err) => {
                    return h.response({message: err.output.payload.message}).code(400).takeover();
                }
            },
        },
        handler: async function (request, h) {
            try {
                await Client.findByIdAndUpdate(request.payload.id, request.payload);
                return h.response({message: 'Client changed successfully!'}).code(200).takeover();
            } catch (e){
                console.log(e);
            }
        }
    },
    {
        method: 'DELETE',
        path: `/${MODEL_NAME}/remove`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                await Client.deleteOne({_id: request.payload.id});
                return h.response({message: 'Client deleted!'});
            } catch (e){
                console.log(e);
            }
        }
    },
    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}/report`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const client = await Client.findById(request.params.id);
                const clientWorksitesItem = [];
                const promises = client.worksites.items.map(async (el) => {
                    const worksites = await Worksites.findById(el.WorksitesId);
                    clientWorksitesItem.push(worksites);
                })
                await Promise.all(promises);
                const employeesName = [];

                const promisesEmployees = clientWorksitesItem.map(async (item) => {
                    const promisesJob = item.job.items.map(async (index) => {
                        const job = await Job.findById(index.JobId);
                        employeesName.push(job);
                    })
                    await Promise.all(promisesJob);
                })
                await Promise.all(promisesEmployees);
                const employeesItem = [];
                const promisesEmployeesItem = employeesName.map(async(el) => {
                    const employees = await Employees.findById(el.employeesID);
                    const worksites = await Worksites.findById(el.worksiteID);
                    employeesItem.push({
                        employees: employees,
                        job: el,
                        worksites: worksites
                    })
                })
                await Promise.all(promisesEmployeesItem);
                return h.response({client, clientWorksitesItem, employeesItem}).code(200).takeover();
            } catch (e) {
                console.log(e);
            }
        }
    }
]