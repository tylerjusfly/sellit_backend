import { TUserType } from '../interfaces/user';
import { LogHelper } from '../utils/LogHelper';
import { transporter } from './nodemailer';

const company_name = 'testme';

export const sendUserVerificationToken = async (user: TUserType) => {
	let mailOptions = {
		from: 'tabbnabbers@gmail.com', // TODO: email sender
		to: user.email, // TODO: email receiver
		subject: `Welcome to ${company_name}`,
		template: 'userverification',
		context: {
			email: user.email,
			storename: user.storename,
			token: user.token,
			companyname: company_name,
		},
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			// Log error for unsent mail
			LogHelper.error(error);
		} else {
			// Mail sent successfully
			LogHelper.info('Email sent: ' + info.response);
		}
	});
};
