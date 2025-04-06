import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { validateRequest } from '../../middlewares/validate-body';
// import { deleteMiddleware } from '../../middlewares/delete-item';
import { CreateTicket } from './tickets.service';
import { postTicketSchema } from './tickets.schema';

const TicketsRouter = Router();

TicketsRouter.post('/', validateRequest(postTicketSchema), CreateTicket);

export const TicketsController = { router: TicketsRouter };
