import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
  } from "@azulul_mobius/common";
  
  export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  }