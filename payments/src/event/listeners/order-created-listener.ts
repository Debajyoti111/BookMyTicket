import { Listener, Subjects, OrderCreateEvent } from "@azulul_mobius/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order"

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "orders-service";

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      version: data.version,
      status: data.status,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}