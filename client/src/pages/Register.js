
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const[usernameError, setUsernameError] = useState("");
  const[passwordError, setPasswordError] = useState("");

  async function registerUser(event){
    // prevent page from refreshing
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");

    if(!username || !password){
      setUsernameError("Please enter username");
      setPasswordError("Please enter password");
    }

    else if (password.length < 8 || password.length > 16){
      setPasswordError("Password must be between 8-16 characters");
    }

    else{
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          // telling the server we are sending JSON
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })


      const data = await response.json();

      if(data.status === "ok"){
        alert("Registration Successful");
        navigate("/login");
      }
      else if (data.status === "error"){
        if(data.error === "Username already exists"){
          setUsernameError(data.error);
        }
        else if(data.error === "Please enter username"){
          setUsernameError(data.error);
        }
        else if(data.error === "Password must be between 8-16 characters"){
          setPasswordError(data.error);
        }
      }
      console.log(data);
    }

    
  }

  async function loginClick(){
    window.location.href = "/login";
  }

  return (

    <div>
      <h1>
        Register
      </h1>
      <form onSubmit={registerUser}>
      <label> Username </label><br/>
        <input 
          type="text" 
          placeholder="username" 
          onChange={(event) => {setUsername(event.target.value)}}
        /><br/>
        {usernameError && <p style={{color: "red"}}>{usernameError}</p>}
        <label> Password </label><br/>
        <input
          type="password"
          placeholder="password"
          onChange={(event) => {setPassword(event.target.value)}}
        /><br/>
        {passwordError && <p style={{color: "red"}}>{passwordError}</p>}
        <button>Register</button>
      </form>
      <button onClick={loginClick}>Back to login page</button>
    </div>


  )

}

export default App;
