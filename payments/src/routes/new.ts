import express, {Request, Response} from "express";
import { body } from "express-validator";
import "express-async-errors";
import { validateRequest, requireAuth, BadRequestError, NotFoundError
, NotAuthorizedError, OrderStatus } from "@azulul_mobius/common";
import { stripe } from "./stripe";
import { Order } from "../model/order";
import {Payment} from "../model/payment";
import { PaymentCreatedPublisher } from "../event/publishers/payment-completed-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post("/api/payments", requireAuth, [ 
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty()
], validateRequest, 
async (req:Request, res:Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled) 
    {
        throw new BadRequestError("Cannot pay for a cancelled order");
    }
    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: "usd",
        source: token,
    });
    const payment = Payment.build({
        orderId: orderId,
        stripeId: charge.id
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
    res.send({message:"Done"});
})

export {router as createChargeRouter};