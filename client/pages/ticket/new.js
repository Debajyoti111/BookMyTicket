import {useState} from "react";
import useRequest from "../../hooks/use-request";
const NewTicket= ({currentUser})=>{
    const [title,setTitle]=useState("");
    const [price, setPrice]=useState(0);
    const {doRequest, errors} = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price
        },
        onSuccess: (ticket)=>{ console.log(ticket);
            setPrice(0);
            setTitle("")
        }
    })
    const onSubmit=(e)=>{
        e.preventDefault();
        doRequest();
    }
    return (
        currentUser && (<div className="container">
            
            <div style={{width:"50%", marginLeft:"45vh", marginTop:"20vh", backgroundColor:"purple",
            padding:"5%", borderRadius:"3%", color:"white"}}>
            <h1> Create Ticket</h1>
            <form onSubmit={(e)=>{onSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" value={title} className="form-control" id="title" placeholder="Enter title" 
                    onChange={(e)=> setTitle(e.target.value)}/>
                </div>
                <div className="form-group mb-5">
                    <label htmlFor="price">Price</label>
                    <input type="string" value={price} className="form-control" id="price" placeholder="Enter price" 
                    onChange={(e)=> setPrice((e.target.value))}
                    />
                </div>
                <>{errors}</>
                <button className="btn btn-primary btn-dark" style={{marginTop:"15px"}}>Submit</button>
            </form>
            </div>
        </div>)
    )
}

export default NewTicket;