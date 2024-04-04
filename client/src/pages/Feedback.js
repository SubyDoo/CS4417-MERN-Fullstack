
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";
//import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";  

function App() {


  const [feedback, setFeedback] = useState("");
  const[feedbackResponse, setFeedBackResponse] = useState("");

  async function sendFeedback(event){
    // prevent page from refreshing
    event.preventDefault();

    setFeedBackResponse("");

    if(!feedback){
      setFeedBackResponse("Cannot send empty feedback");
    }

    else if (feedback.length >= 5000){
      setFeedBackResponse("Feedback must be less than 5000 characters");
    }

    else{
      const response = await fetch("https://localhost:3001/sendfeedback", {
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

      if (data.status === "ok"){
        setFeedBackResponse("Thank you for your feedback");
      }
      else if (data.error === "Cannot send empty feedback"){
        setFeedBackResponse("Cannot send empty feedback");
      }
      else if (data.error === "Feedback must be less than 5000 characters"){
        setFeedBackResponse("Feedback must be less than 5000 characters");
      }

      // this reset the text in the form
      setFeedback("");
      //console.log(data);
    }
    
  }

  
 const navigate = useNavigate()

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          const user = jwtDecode(token)
          if (!user) {
              localStorage.removeItem("token");
              navigate("/login");
          }
          else if (user.exp * 1000 < Date.now()) {
              localStorage.removeItem("token");
              navigate("/login");
          }
      }
      else{
        localStorage.removeItem("token");
        navigate("/login");
      }
  })


  return (
    
    <div>
      <NavBar/>
      <h1>
        Feedback Form
      </h1>
      <form onSubmit={sendFeedback}>
        <textarea 
          type="text" 
          placeholder="please enter some feedback" 
          onChange={(event) => {setFeedback(event.target.value); setFeedBackResponse("");}}
          value={feedback}
        /><br/>
        {feedbackResponse === "Thank you for your feedback" && <p style={{color: "green"}}>{feedbackResponse}</p>}
        {feedbackResponse === "Cannot send empty feedback" && <p style={{color: "red"}}>{feedbackResponse}</p>}
        {feedbackResponse === "Feedback must be less than 5000 characters" && <p style={{color: "red"}}>{feedbackResponse}</p>}
        <button>Send Feedback</button>
      </form>
    </div>

  )
}

export default App;