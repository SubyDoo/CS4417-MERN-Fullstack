
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";
//import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function App() {

  
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



  async function goToFeedback(event){
    // prevent page from refreshing
    event.preventDefault();
    window.location.href = "/feedback";
  }


  return (

    <div>
      <h1>
        Lost Page
      </h1>
      <form onSubmit={goToFeedback}>
        <input type="submit" value="Go to Feedback" />
    </form>
    </div>
  )
}

export default App;
