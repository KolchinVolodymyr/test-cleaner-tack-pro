'use strict';

const MODEL_NAME = 'worksites';
const Worksites = require('./schema');
const Client = require('../client/schema');
const Job = require('../job/schema');
const Joi = require("@hapi/joi");

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
            try {
                const worksites = await Worksites.find();
                return h.response(worksites).code(200).takeover();
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
                    address: Joi.string().min(3).required().error(new Error('Minimum address length 3 characters')),
                    type: Joi.string().min(1).required().error(new Error('Select from the dropdown list')),
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
            const worksites = new Worksites({
                name: request.payload.name,
                address: request.payload.address,
                type: request.payload.type,
                status: request.payload.status,
            });
            worksites.save();
            if (!worksites) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Worksites successfully created !!!'}).code(201).takeover();
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
                const worksites = await Worksites.findById(request.params.id);
                const client = await Client.findById(worksites.clientID);
                const clientList = await Client.find();
                const worksitesJob = [];
                const promises = worksites.job.items.map(async (el) => {
                    const job = await Job.findById(el.JobId);
                    worksitesJob.push(job);
                })
                await  Promise.all(promises);
                return h.response({worksites, client, clientList, worksitesJob}).code(200).takeover();
            } catch (e) {
                console.log(e);
            }
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
                    address: Joi.string().min(3).required().error(new Error('Minimum address length 3 characters')),
                    type: Joi.string().min(1).required().error(new Error('Select from the dropdown list')),
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
            try {
                await Worksites.findByIdAndUpdate(request.payload.id, request.payload);
                const worksites = await Worksites.findById(request.params.id);
                const client = await Client.findById(worksites.clientID);

                const currentClient = await Client.findById(request.payload.currentClientID);
                if(currentClient !== null) {
                    await currentClient.deleteWorksites(worksites)
                }

                if(client !== null) {
                    await client.addToWorksites(worksites);
                }
                return h.response({message: 'Worksites changed successfully!'}).code(200).takeover();
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
                await Worksites.deleteOne({_id: request.payload.id});
                return h.response({message: 'Worksites deleted!'});
            } catch (e){
                console.log(e);
            }
        }
    }
]



