
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";
//import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function App() {


  const [feedback, setFeedback] = useState("");


  async function sendFeedback(event){
    // prevent page from refreshing
    event.preventDefault();

    const response = await fetch("http://localhost:3001/sendfeedback", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        // telling the server we are sending JSON
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("token")
      },
      body: JSON.stringify({
        feedbacktext: feedback
      })
    })

    const data = await response.json();
    console.log(data);
  }

  
 const navigate = useNavigate()

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          const user = jwtDecode(token)
          if (!user) {
              localStorage.removeItem("token");
              navigate("/login");
              //window.location.href = "/";
          }
          else{
            
          }
      }
  })


  return (

    <div>
      <h1>
        Feedback Form
      </h1>
      <form onSubmit={sendFeedback}>
        <input 
          type="text" 
          placeholder="please enter some feedback" 
          onChange={(event) => {setFeedback(event.target.value)}}
        /><br/>
        <button>Send Feedback</button>
      </form>
    </div>


  )

}

export default App;
