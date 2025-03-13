import Joi from 'joi';

export const loginStoreSchema = Joi.object({
	storename: Joi.string().min(4).required(),
	password: Joi.string().min(8).required(),
});

export const verifyAccountSchema = Joi.object({
	email: Joi.string().required(),
	code: Joi.string().required(),
}).unknown();
