import {
    Subjects,
    Listener,
    OrderCreateEvent,
    OrderStatus,
  } from "@azulul_mobius/common";
  
  import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../nats-wrapper";
  import  expirationQueue  from "../../queues/queue";
import { ExpirationCompletePublisher } from "../publishers/expiration-complete-publisher";
  
  export class OrderCreatedListener extends Listener<OrderCreateEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "expiration";
    async onMessage(data: OrderCreateEvent["data"], msg: Message) {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
  
      console.log(`Waiting ${delay} milliseconds to process the job`);
    setTimeout(()=>{
        console.log("Expiration job: ", data);

     new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: data.id,
        })
    }, delay);
    msg.ack();
  }}