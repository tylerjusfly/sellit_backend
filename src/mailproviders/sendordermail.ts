import { dataSource } from '../database/dataSource.js';
import { Orders } from '../database/entites/orders.entity.js';
import { LogHelper } from '../utils/LogHelper.js';
import { transporter } from './nodemailer.js';

export const sendOrderMail = async (orderid: string) => {
	const orderData = await dataSource.getRepository(Orders).findOne({
		where: {
			id: orderid,
		},
	});

	if (!orderData) {
		return;
	}

	let mailOptions = {
		from: 'tabbnabbers@gmail.com', // TODO: email sender
		to: orderData.order_from, // TODO: email receiver
		subject: 'Order Success',
		text: 'Sucessful Order !!',
		template: 'orderitems',
		context: {
			orderid: orderData.id,
			name: orderData.order_from,
			status: orderData.order_status,
			total: orderData.total_amount,
		},
		attachments: [
			{
				filename: `${orderData.product_name}-items.bin`,
				content: `${orderData.items}`,
				contentType: 'text/plain',
			},
		],
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
