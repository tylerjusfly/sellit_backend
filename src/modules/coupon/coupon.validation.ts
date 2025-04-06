import Joi from 'joi';

export const couponSchema = Joi.object({
    coupon_code: Joi.string().required(),
    type: Joi.string().required(),
    coupon_value: Joi.string().required(),
}).unknown();
