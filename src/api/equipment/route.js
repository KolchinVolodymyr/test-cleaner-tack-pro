'use strict';

const MODEL_NAME = 'equipment';
const Equipment = require('./schema');
const Joi = require("@hapi/joi");
const Job = require('../job/schema');

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
            const equipment = await Equipment.find();
            return h.response({equipment}).code(200).takeover();
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
                const equipment = await Equipment.findById(request.params.id);
                const job = await Job.find();
                let equipmentJob = [];
                job.map((el)=>{
                    el.additionalEquipment.map((index)=>{
                        if(index._id === request.params.id) {
                            equipmentJob.push(el);
                        }
                    })
                })
                return h.response({equipment, equipmentJob}).code(200).takeover();
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
                   storageLocation: Joi.string().min(3).required().error(new Error('Minimum Storage Location length 3 characters')),
                   usageFee: Joi.number().integer().required().error(new Error('Enter the correct Usage fee')),
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
            const equipment = new Equipment({
                name: request.payload.name,
                storageLocation: request.payload.storageLocation,
                usageFee: request.payload.usageFee,
                status: request.payload.status,
            });
            equipment.save();
            if (!equipment) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Equipment successfully created !!!'}).code(201).takeover();
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
                    storageLocation: Joi.string().min(3).required().error(new Error('Minimum Storage Location length 3 characters')),
                    usageFee: Joi.number().integer().required().error(new Error('Enter the correct Usage fee')),
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
                await Equipment.findByIdAndUpdate(request.payload.id, request.payload);
                return h.response({message: 'Equipment changed successfully!'}).code(200).takeover();
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
                await Equipment.deleteOne({_id: request.payload.id});
                return h.response({message: 'Equipment deleted!'});
            } catch (e){
                console.log(e);
            }
        }
    }

]