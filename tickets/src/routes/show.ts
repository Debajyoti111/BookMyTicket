import express, {Request, Response} from 'express';
import {Ticket} from "../models/TicketModel";
import { NotFoundError } from '@azulul_mobius/common';

const router = express.Router();

router.get("/api/tickets/:id", async(req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket)
    {
        throw new NotFoundError();
    }
    res.send(ticket);
});

export {router as displayTicketRouter};