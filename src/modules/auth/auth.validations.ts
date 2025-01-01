import { body } from 'express-validator';
import Joi from 'joi';

export const loginValidationRules = [
	body('storename').notEmpty().withMessage('storename is required'),
	body('password').notEmpty().withMessage('password is required'),
	body('password').isLength({ min: 8 }).withMessage('Password should be at least 8 chars'),
	// body('storename').isLength({ min: 4 }).withMessage('storename should be at least 4 chars'),
	// body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

export const verifyAccountSchema = Joi.object({
	email: Joi.string().required(),
	code: Joi.string().required(),
}).unknown();
