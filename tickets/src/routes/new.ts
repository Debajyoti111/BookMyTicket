import express, {Request, Response} from 'express';
import { requireAuth, currentUser, validateRequest} from '@azulul_mobius/common';
import {body} from "express-validator";
import {Ticket} from "../models/TicketModel";
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post("/api/tickets", requireAuth, [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({gt: 0}).withMessage("Price must be provided and must be greater than 0")
],validateRequest, async(req: Request, res: Response) => {
    const {title, price} = req.body;
    const ticket = Ticket.build({
        title,
        price: Number(price),
        userId: req.currentUser!.id
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket._id,
        title: ticket.title,
        price: Number(ticket.price),
        userId: ticket.userId,
        version: ticket.version
    });
    res.status(201).send(ticket);
});

export {router as createTicketRouter};