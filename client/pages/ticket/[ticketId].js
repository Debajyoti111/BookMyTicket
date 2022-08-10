import useRequest from "../../hooks/use-request";
import Router from "next/router";
const TicketShow = ({ticket})=>{
    const {doRequest, errors} = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order)=>{ 
            Router.push("/orders/[orderId]", `/orders/${order._id}`);
    }});
    return (
        <div className="container">
            <div style={{width:"50%", marginLeft:"45vh", marginTop:"25vh", backgroundColor:"purple",
            padding:"5%", color:"white"}}>
            <h2> Title:<span style={{fontSize:"2=1.7rem", marginLeft:"20px"}}> {ticket.title}</span></h2>
            <h3> Price: <span style={{fontSize:"2=1.7rem", marginLeft:"20px"}}>{ticket.price}</span></h3>
            <button className="btn btn-primary btn-dark" style={{position:"relative"
            , left:"20vw", bottom:"5vh", width:"15rem", height:"3rem"}}
            onClick={(e)=>doRequest()}>Purchase</button>
            {errors}
            </div>
        </div>
    )
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
}

export default TicketShow;