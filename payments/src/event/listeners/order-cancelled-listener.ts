import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from "@azulul_mobius/common";
import {Message} from "node-nats-streaming";
import {Order} from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "payments-service";
    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const order = await Order.findOne({
            _id:data.id,
            version:data.version - 1
        });
        if (!order) throw new Error('Order not found');
        order.set({status: OrderStatus.Cancelled});
        await order.save();
        msg.ack();
    }
}