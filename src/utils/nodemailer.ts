import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	auth: {
		user: 'tylerjusfly1@gmail.com',
		pass: 'czmpfrduvibtunoc ',
	},
});
