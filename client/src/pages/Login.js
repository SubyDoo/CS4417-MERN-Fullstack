
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function App() {

  // allow to navigate to another page
  const navigate = useNavigate()

  // these states are for the username and password fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // this state is for the login response
  const[loginResponse, setLoginResponse] = useState("");

  async function loginUser(event){

    // prevent page from refreshing
    event.preventDefault();

    // check if all fields are filled
    if(!username || !password){
      setLoginResponse("Please enter username and password");
    }

    // send request to server to login
    else{
      const response = await fetch("https://localhost:3001/login", {
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

      if (data.user){
        localStorage.setItem("token", data.user);
        window.location.href = "/feedback";
      }
      else if (data.error === "Invalid username or password"){
        setLoginResponse("Invalid username or password");
      }
    }
  }

  // function to go to register page
  async function registerClick(){
    window.location.href = "/register";
  }

  // check if user is logged in, if so redirect to feedback page
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
        Login
      </h1>
      <form onSubmit={loginUser}>
        <label> Username: </label><br/>
        <input 
          type="text" 
          placeholder="type your username" 
          onChange={(event) => {setUsername(event.target.value); setLoginResponse("")}}
        /><br/>
        
        <label> Password: </label><br/>
        <input
          type="password"
          placeholder="type your password"
          onChange={(event) => {setPassword(event.target.value); setLoginResponse("")}}
        /><br/>
        {loginResponse === "Invalid username or password" && <p style={{color: "red"}}>{loginResponse}</p>}
        {loginResponse === "Please enter username and password" && <p style={{color: "red"}}>{loginResponse}</p>}
        <button>Login</button>
      </form>
      <button onClick={registerClick}>Click here to go register an account</button>
    </div>
  )
}

export default App;