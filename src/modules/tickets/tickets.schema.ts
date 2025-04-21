import Joi from 'joi';

export const postTicketSchema = Joi.object({
	shop_id: Joi.string().required(),
	title: Joi.string().required(),
	email: Joi.string().required(),
	order_id: Joi.string().required(),
}).unknown();
