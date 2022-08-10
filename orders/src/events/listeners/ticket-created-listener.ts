import { Listener, Subjects, TicketCreatedEvent } from "@azulul_mobius/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticketdoc";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "orders-service";
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });
    await ticket.save();
    msg.ack();
  }
}