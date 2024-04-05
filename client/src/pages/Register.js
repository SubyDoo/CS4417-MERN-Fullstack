
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function App() {

  // allow to navigate to another page
  const navigate = useNavigate();
  // these states are for the username and password fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // these states are for the register responses
  const[usernameError, setUsernameError] = useState("");
  const[passwordError, setPasswordError] = useState("");

  async function registerUser(event){

    // prevent page from refreshing
    event.preventDefault();
    // reset error responses
    setUsernameError("");
    setPasswordError("");

    // check if all fields are filled
    if(!username || !password){
      setUsernameError("Please enter username");
      setPasswordError("Please enter password");
    }

    // check if password is between 8-16 characters
    else if (password.length < 8 || password.length > 16){
      setPasswordError("Password must be between 8-16 characters");
    }

    // send request to server to register
    else{
      const response = await fetch("https://localhost:3001/register", {
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

      // get response
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
    }
  }

  // function to go to login page
  async function loginClick(){
    window.location.href = "/login";
  }

  // check if user is logged in, if not, redirect to login, else go to feedback
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token)
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      else if (user.exp < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      else{
        navigate("/feedback");
      }
    }
    else{
      localStorage.removeItem("token");
    }
  })


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