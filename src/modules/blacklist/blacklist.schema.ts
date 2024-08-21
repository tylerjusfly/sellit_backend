import Joi from 'joi';

export const postBlacklistSchema = Joi.object({
	type: Joi.string().required(),
	data: Joi.string().required(),
	note: Joi.string().required(),
	shop_id: Joi.number().required(),
}).unknown();
