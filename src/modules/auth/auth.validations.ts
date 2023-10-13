import { body } from 'express-validator';

export const loginValidationRules = [
	body('username').notEmpty().withMessage('username is required'),
	body('password').notEmpty().withMessage('Description is required'),
	body('password').isLength({ min: 8 }).withMessage('Password should be at least 8 chars'),
	body('username').isLength({ min: 4 }).withMessage('Username should be at least 4 chars'),
	// body('completed').isBoolean().withMessage('Completed must be a boolean'),
];
