import Joi from 'joi';

export const createCategorySchema = Joi.object({
    category_name: Joi.string().required(),
}).unknown();