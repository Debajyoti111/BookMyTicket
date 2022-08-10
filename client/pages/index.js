import buildClient from '../api/build-client';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = Object.values(tickets).map(ticket=>{
    return (
          <tr> <td>{ticket.title}</td> <td>{ticket.price}</td> <td>
            <Link href="/ticket/[ticketId]" as={`/ticket/${ticket.id}`}>
              <button className="btn btn-dark btn-dark-lg">View</button>
            </Link>
          </td> </tr>
    )
  });
  return (
    currentUser? (tickets.length>0?((<div className='container'>
          <div style={{margin:"8vh 15vh", backgroundColor:"purple", color:"white", padding:"2rem",
    borderRadius:"0.5%"}}>
      <h1>Tickets</h1>
      <table className='table'>
        <thead style={{textAlign:"center", color:"white", fontFamily:"monospace", fontSize:"1.5rem"}}>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Purchase</th>
          </tr>
        </thead>
        <tbody style={{textAlign:"center", color:"whitesmoke"}} >
          {ticketList}  
        </tbody>
      </table>
    </div>
    </div>)):(<div className='container' style={{margin:"8vh 15vh", backgroundColor:"purple", color:"white", padding:"2rem",
    borderRadius:"0.5%", textAlign:"center"}}>
        <h1> No Tickets Available To See</h1>
      </div>)):(
      <div className='container' style={{margin:"8vh 15vh", backgroundColor:"purple", color:"white", padding:"2rem",
    borderRadius:"0.5%", textAlign:"center"}}>
        <h1> Sign In To See The Tickets</h1>
      </div>
    )

  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
}
export default LandingPage;
