'use strict';

const MODEL_NAME = 'job';
const Job = require('./schema');
const Joi = require("@hapi/joi");
const Worksites = require('../worksites/schema');
const Employees = require('../employees/schema');
const Equipment = require('../equipment/schema');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            const worksites = await Worksites.find();
            const employees= await Employees.find();
            const equipment= await Equipment.find();
            return h.response({worksites, employees, equipment}).code(200).takeover();
        }
    },
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
            const job = await Job.find();
            return h.response({job}).code(200).takeover();
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
                const job = await Job.findById(request.params.id);
                const worksitesList = await Worksites.find();
                const employees = await Employees.find();
                const equipment = await Equipment.find();
                return h.response({job, worksitesList, employees, equipment}).code(200).takeover();
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
                   worksiteID: Joi.string().min(3).required().error(new Error('Select from the dropdown list worksite')),
                   type: Joi.string().min(3).required().error(new Error('Select from the dropdown list type')),
                   hazardousMaterials: Joi.string().min(3).required().error(new Error('Select hazardous materials from the drop-down list')),
                   serviceFee: Joi.number().integer().required().error(new Error('Enter the correct service fee')),
                   startDate: Joi.string().min(3).required().error(new Error('Enter the correct start-date')),
                   endDate: Joi.string().min(3).required().error(new Error('Enter the correct end-date')),
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
            const job = new Job({
                worksiteID: request.payload.worksiteID,
                type: request.payload.type,
                hazardousMaterials: request.payload.hazardousMaterials,
                serviceFee: request.payload.serviceFee,
                startDate: request.payload.startDate,
                endDate: request.payload.endDate,
                employeesID: request.payload.employeesID,
                additionalEquipment: request.payload.additionalEquipment,
                status: request.payload.status
            });
            job.save();
            if (!job) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Job successfully created !!!'}).code(201).takeover();
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
                    worksiteID: Joi.string().min(3).required().error(new Error('Select from the dropdown list worksite')),
                    type: Joi.string().min(3).required().error(new Error('Select from the dropdown list type')),
                    hazardousMaterials: Joi.string().min(3).required().error(new Error('Select hazardous materials from the drop-down list')),
                    serviceFee: Joi.number().integer().required().error(new Error('Enter the correct service fee')),
                    startDate: Joi.string().min(3).required().error(new Error('Enter the correct start-date')),
                    endDate: Joi.string().min(3).required().error(new Error('Enter the correct end-date')),
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
                await Job.findByIdAndUpdate(request.payload.id, request.payload);
                const job = await Job.findById(request.params.id);
                const currentWorksites = await Worksites.findById(request.payload.currentWorksiteID);
                if(currentWorksites !== null) {
                    await currentWorksites.deleteJobs(job)
                }
                const worksites = await Worksites.findById(job.worksiteID);
                if(worksites !== null) {
                    await worksites.addToJobs(job);
                }
                return h.response({message: 'Job changed successfully!'}).code(200).takeover();
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
                await Job.deleteOne({_id: request.payload.id});
                return h.response({message: 'Job deleted!'});
            } catch (e){
                console.log(e);
            }
        }
    }

]