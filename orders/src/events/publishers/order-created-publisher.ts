import { Publisher, Subjects, OrderCreateEvent } from "@azulul_mobius/common";

export class OrderCreatedPublisher extends Publisher<OrderCreateEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}