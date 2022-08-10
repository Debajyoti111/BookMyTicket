import { Listener, Subjects, OrderCreateEvent, BadRequestError } from "@azulul_mobius/common";
import {Message} from "node-nats-streaming";
import { Ticket } from "../../models/TicketModel";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreateEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "tickets-service";
    async onMessage(data: OrderCreateEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket) throw new BadRequestError("Ticket not found");
        ticket.set({orderId: data.id});
        await ticket.save();
        console.log(ticket);
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });
        msg.ack();
    }
 }