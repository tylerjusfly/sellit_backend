import { dataSource } from '../database/dataSource';
import { Orders } from '../database/entites/orders.entity';
import { LogHelper } from './LogHelper';
import { transporter } from './nodemailer';

export const sendOrderMail = async (orderid: number) => {
	const orderData = await dataSource.getRepository(Orders).findOne({
		where: {
			id: orderid,
		},
	});

	if (!orderData) {
		return;
	}

	const html = `Hey ${orderData.order_from} this is your product ${orderData.items}`;

	const creditsMail = {
		from: 'admin.AnyBuy',
		to: orderData.order_from,
		subject: 'Order Success',
		html: html,
	};

	transporter.sendMail(creditsMail, function (error, info) {
		if (error) {
			// Log error for unsent mail
			console.log(error);
		} else {
			// Mail sent successfully
			LogHelper.info('Email sent: ' + info.response);
		}
	});
};
