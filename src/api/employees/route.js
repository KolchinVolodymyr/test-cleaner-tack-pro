'use strict';

const MODEL_NAME = 'employees';
const Employess = require('./schema');
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
            const employees = await Employess.find();
            return h.response({employees}).code(200).takeover();
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
                const employees = await Employess.findById(request.params.id);
                const job = await Job.find();
                let employeesJob = [];
                job.map((el)=>{
                    if(el.employeesID === request.params.id) {
                        employeesJob.push(el)
                    }
                })
                return h.response({employees, employeesJob}).code(200).takeover();
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
                   phone: Joi.number().integer().required().error(new Error('Enter the correct phone')),
                   salary: Joi.number().integer().required().error(new Error('Enter the correct salary')),
                   date_of_birth: Joi.string().min(3).required().error(new Error('Enter the correct date of birth')),
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
            const employees = new Employess({
                name: request.payload.name,
                address: request.payload.address,
                phone: request.payload.phone,
                salary: request.payload.salary,
                date_of_birth: request.payload.date_of_birth,
                status: request.payload.status,
            });
            employees.save();
            if (!employees) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Employees successfully created !!!'}).code(201).takeover();
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
                    phone: Joi.number().integer().required().error(new Error('Enter the correct phone')),
                    salary: Joi.number().integer().required().error(new Error('Enter the correct salary')),
                    date_of_birth: Joi.string().min(3).required().error(new Error('Enter the correct date of birth')),
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
                await Employess.findByIdAndUpdate(request.payload.id, request.payload);
                return h.response({message: 'Employees changed successfully!'}).code(200).takeover();
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
                await Employess.deleteOne({_id: request.payload.id});
                return h.response({message: 'Employees deleted!'});
            } catch (e){
                console.log(e);
            }
        }
    }

]