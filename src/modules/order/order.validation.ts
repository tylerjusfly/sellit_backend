import Joi from 'joi';

export const paymentOrderSchema = Joi.object({
	shopid: Joi.string().required(),
	// code: Joi.string().required(),
}).unknown();
