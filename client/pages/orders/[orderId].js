import { createRouter } from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import axios from "axios";
const OrderShow = ({order, orderId, currentUser})=>{
    const [tokenKey, setTokenKey] = useState(null);
    const {doRequest, errors} = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: orderId,
        },
        onSuccess: (payment)=>{
            console.log(payment);
            Router.push("/orders");
        }
    });
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(()=>{
        const findTimeLeft = ()=>{
        const msLeft = new Date(order.expiresAt) - new Date();
        setTimeLeft(Math.round(msLeft/1000));
    }
    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);
    return ()=>{
        clearInterval(timer);
    }
}, [order]);
    if(timeLeft < 0) return <div><h1>Order Expired!</h1></div>
    return (
    <div className="container" style={{width:"50%",
    height:"50%", backgroundColor:"purple", marginTop:"30vh", padding:"4rem",
    color:"white", marginBottom:"15px"}}>
        <h2>Time left: {timeLeft} seconds until order expires</h2>
    <StripeCheckout token={({id})=>{setTokenKey(id);
    doRequest({token: id});}} 
    amount={order.ticket.price * 100}
    email={currentUser.email}
    stripeKey="pk_test_51LVLOdJKH6VFpyeclIsKCStF7kaPKk2MnTDmQ2f5STNsL1V20RrBB7Eyo99BHrjDQZ870mwKpcwPDb4I8FAPrOSO00PGIOxAE6"/>
    {errors}
    </div>)
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data, orderId: orderId };
}
export default OrderShow;