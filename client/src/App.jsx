import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [msg, setMsg] = useState("");
  const [room, setroom] = useState("");
  const [socketid,setSocketid] = useState("")
  const [messages,setMessages] = useState([])
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on('connect', () => {
      console.log("connected");
      console.log(socketRef.current.id);
      setSocketid(socketRef.current.id)
    });

    socketRef.current.on('new-msg',(msg)=>{
      setMessages((prevMessages) => [...prevMessages, [msg]]);
      console.log(msg)
      console.log(messages)
    })

    socketRef.current.on("welcome",(msg)=>{
      console.log(msg)
      
    })

 
    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handle = (e) => {
    e.preventDefault();
    socketRef.current.emit("msg", {msg,room});
    setMsg(""); // Clear the input after sending the message
  };

  const handleroom =(e)=>{
    e.preventDefault()
    socketRef.current.emit("join-room", room);
  }

  return (
    <div>
      <text>{socketid}</text>
      <form onSubmit={handleroom}>
        <input value={room} placeholder='enter room name' onChange={e => setroom(e.target.value)} />
        
       
        <button type="submit">join</button>
      </form>
      <form onSubmit={handle}>
        <input value={msg} placeholder='enter msg' onChange={e => setMsg(e.target.value)} />
        <br/>
        <input value={room} placeholder="enter room"onChange={e=> setroom(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
      <div>
        {

          messages.map((m,i)=>{
              return <h3 key={i}>{m}</h3>
          })
        }
        
      </div>
    </div>
  );
}

export default App;
