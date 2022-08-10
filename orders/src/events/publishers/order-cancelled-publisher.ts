import { Publisher, Subjects, OrderCancelledEvent } from "@azulul_mobius/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}