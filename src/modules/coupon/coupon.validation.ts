import Joi from 'joi';

export const couponSchema = Joi.object({
    coupon_code: Joi.string().required(),
    type: Joi.string().required(),
    coupon_value: Joi.string().required(),
}).unknown();


export const couponSchemaEdit = Joi.object({
	coupon_value: Joi.number().required(),
	type: Joi.string().required(),
	max_use: Joi.number().required(),
	id: Joi.string().required(),
}).unknown();
