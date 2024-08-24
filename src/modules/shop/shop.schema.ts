import Joi from 'joi';

export const shopEditSchema = Joi.object({
	shop_credit: Joi.forbidden(),

	shopid: Joi.number().required(),
	// code: Joi.string().required(),
}).unknown();
