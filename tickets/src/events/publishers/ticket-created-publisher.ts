import { Publisher, Subjects, TicketCreatedEvent } from "@azulul_mobius/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
