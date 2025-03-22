import Joi from 'joi';

export const StoreOrderSchema = Joi.object({
    storename: Joi.string().required(),
}).unknown();