import express, {Request, Response} from 'express';
import { requireAuth, currentUser, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError} from '@azulul_mobius/common';
import {body} from "express-validator";
import {Ticket} from "../models/TicketModel";
const router = express.Router();

router.put("/api/tickets/:id", requireAuth, [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({gt: 0}).withMessage("Price must be provided and must be greater than 0")
],validateRequest, async(req: Request, res: Response) => {
    const {title, price} = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket)
    {
        throw new NotFoundError();
    }
    if(ticket.userId !== req.currentUser!.id)
    {
        throw new NotAuthorizedError();
    }
    if(ticket.orderId)
    {
        throw new BadRequestError("Cannot edit a reserved ticket");
    }
    ticket.set({
        title, price});

    await ticket.save();
    res.status(201).send(ticket);
});

export {router as updateTicketRouter};