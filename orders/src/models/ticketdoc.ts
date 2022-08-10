import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "@azulul_mobius/common";
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs{
    title: string;
    price: number;
    id: string;
    orderId?:string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    orderId?: string;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
  
    return !!existingOrder;
};
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export {Ticket};
