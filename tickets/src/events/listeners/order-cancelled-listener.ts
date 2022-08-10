import {
    Listener,
    Subjects,
    OrderCancelledEvent,
    OrderStatus,
  } from "@azulul_mobius/common";
  import { Message } from "node-nats-streaming";
  import { Ticket } from "../../models/TicketModel";
  import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
  
  export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "tickets-service";
  
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
      const ticket = await Ticket.findById(data.ticket.id);
  
      if (!ticket) {
        throw new Error("Ticket not found");
      }
  
      ticket.set({
        status: OrderStatus.Cancelled,
        orderId: "undefined",
      });
      await ticket.save();
  
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket._id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      });
  
      msg.ack();
    }
  }