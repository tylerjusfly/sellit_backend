import Joi from 'joi';

export const createCategorySchema = Joi.object({
    category_name: Joi.string().required(),
}).unknown();

export const editCategorySchema = Joi.object({
	id: Joi.string().required(),

	category_name: Joi.string(),
	category_postion: Joi.number(),
}).unknown();