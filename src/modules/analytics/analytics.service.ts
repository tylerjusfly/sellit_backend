import type { Response } from 'express';
import { handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import moment from 'moment';
import type { ITokenPayload } from '../../utils/token-helper.js';

export const CustomerRetention = async (req: CustomRequest, res: Response) => {
	try {
		const start = moment().toISOString();
		const end = moment().subtract(30, 'days').toISOString();

		const store = req.user as ITokenPayload;

		const customerRetentionData = await dataSource.query(
			`
            WITH start_customers AS (
              SELECT DISTINCT order_from
              FROM orders
              WHERE created_at BETWEEN $1 AND $2 AND shop_id = $3
            ),
            end_customers AS (
              SELECT DISTINCT order_from
              FROM orders
              WHERE created_at BETWEEN $1 AND $2 AND shop_id = $3
                AND order_from IN (SELECT order_from FROM start_customers)
            )
            SELECT CASE 
              WHEN (SELECT COUNT(*) FROM start_customers) = 0 THEN 0
              ELSE (
                COUNT(DISTINCT order_from) * 100.0 /
                (SELECT COUNT(*) FROM start_customers)
              )
            END AS retention_rate
            FROM end_customers;
            `,
			[start, end, store.id]
		);

		return handleSuccess(res, customerRetentionData, 'store', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};