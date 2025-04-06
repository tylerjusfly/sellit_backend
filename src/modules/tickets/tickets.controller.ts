import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate-body.js';
import { CreateTicket } from './tickets.service.js';
import { postTicketSchema } from './tickets.schema.js';

const TicketsRouter = Router();

TicketsRouter.post('/', validateRequest(postTicketSchema), CreateTicket);

export const TicketsController = { router: TicketsRouter };
