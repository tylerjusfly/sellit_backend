import Joi from 'joi';

export const postTicketSchema = Joi.object({
	shop_id: Joi.number().required(),
	message: Joi.string().required(),
	piority: Joi.string().required(),
	order_id: Joi.string().required(),
}).unknown();
