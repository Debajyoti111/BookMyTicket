import { Listener, Subjects, TicketUpdatedEvent } from "@azulul_mobius/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticketdoc";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "orders-service";
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log(data);
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: Number(data.version) - 1,
    });

    if (!ticket) {
      throw new Error("Error");
    }
    ticket.set({
      title: data.title,
      price: data.price,
    });
    await ticket.save();
    msg.ack();
  }
}