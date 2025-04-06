import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { ENV } from '../constants/env-variables.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	auth: {
		user: ENV.EMAIL_USER,
		pass: ENV.EMAIL_SECRET,
	},
});

// verify connection configuration
transporter.verify(function (error, success) {
	if (error) {
		console.log('Email server connection error! ' + error);
	} else {
		console.log('Email server is ready to take our messages! ' + success);
	}
});

const options = {
	viewEngine: {
		extname: '.hbs',
		defaultLayout: '',
		layoutsDir: join(__dirname, './htmltemplates'),
	},
	viewPath: join(__dirname, './htmltemplates'),
	extName: '.hbs',
};

transporter.use('compile', hbs(options));


