import type { Response } from 'express';

import { handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';
import { transporter } from '../../mailproviders/nodemailer.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import { LogHelper } from '../../utils/LogHelper.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import { Notification } from '../../database/entites/notifications.entity.js';

export const sendNotification = async (
	store_id: string,
	message: string,
	type: string,
	title: string
) => {
	try {
		const ToCreate = dataSource.getRepository(Notification).create({
			store_id: store_id,
			title: title,
			message,
			type,
			read: false,
		});

		await ToCreate.save();
	} catch (error: any) {
		//   throw new Error(error?.message || "Failed to create notification")
		// Fail silently
	}
};

export const sendStoreEmail = (
	email: string,
	options: {
		storename: string;
		message: string;
		ticket_id?: string;
		ctaUrl?: string;
		ctaLabel?: string;
	}
) => {
	// Send mail
	const creditsMail = {
		from: 'admin.sellit',
		to: email,
		subject: 'Sellit Notification',
		html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIy3gpnqUu3MIL8ZhNqQzv9RvPBlHU2JHioA&s" alt="Company Logo" style="max-height: 60px;" />
        </div>

        <h1 style="color: #2c3e50; text-align: center;">${options.storename}</h1>

        <p style="font-size: 16px; line-height: 1.6;">
          ${options.message}<br/><br/>

          ${options.ticket_id ? `<br/><br/><strong>Ticket ID:</strong> ${options.ticket_id}` : ''}
        </p>


         ${
						options.ctaUrl && options.ctaLabel
							? `
        <div style="text-align: center; margin-top: 30px;">
          <a href="${options.ctaUrl}" style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            display: inline-block;
          ">${options.ctaLabel}</a>
        </div>
      `
							: ''
					}

        <br />

        <p style="font-size: 14px; color: #888; text-align: center;">
          If you have any questions, feel free to visit our support page.<br>
          – The Team
        </p>
      </div>
    `,
	};

	transporter.sendMail(creditsMail, function (error, info) {
		if (error) {
			// Log error for unsent mail
			LogHelper.error(error);
		} else {
			// Mail sent successfully
			LogHelper.info('Email sent: ' + info.response);
		}
	});
};

export const fetchStoreNotifications = async (req: CustomRequest, res: Response) => {
	try {
		const store = req.user as ITokenPayload;

		const [notifications, total] = await Notification.findAndCount({
			where: {
				store_id: store.id,
				read: false,
			},

			order: { updated_at: 'DESC' },
		});

		return handleSuccess(
			res,
			{
				data: notifications,
				count: total,
			},
			``,
			200,
			undefined
		);
	} catch (error) {
		return handleError(res, error);
	}
};
