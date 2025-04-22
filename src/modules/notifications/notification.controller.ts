// fetchStoreNotifications

import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { fetchStoreNotifications } from './notification.service.js';
import { Notification } from '../../database/entites/notifications.entity.js';
import { deleteMiddleware } from '../../middlewares/delete-item.js';


const NotificationRouter = Router();

NotificationRouter.get('/', verifyToken, fetchStoreNotifications);
NotificationRouter.delete('/', verifyToken, deleteMiddleware(Notification, false));


export const NotificationController = { router: NotificationRouter };
