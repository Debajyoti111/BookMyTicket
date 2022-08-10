import {Publisher, Subjects, PaymentCreateEvent} from '@azulul_mobius/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreateEvent> {
    subject:Subjects.PaymentCreated = Subjects.PaymentCreated;
}