import Joi from 'joi';

export const postBlacklistSchema = Joi.object({
	type: Joi.string().required(),
	data: Joi.string().required(),

	shop_id: Joi.forbidden(),
}).unknown();
