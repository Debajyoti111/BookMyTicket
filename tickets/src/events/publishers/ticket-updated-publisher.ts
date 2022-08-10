import { Publisher, Subjects, TicketUpdatedEvent } from "@azulul_mobius/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
