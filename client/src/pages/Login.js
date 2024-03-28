
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";


function App() {


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  async function loginUser(event){
    // prevent page from refreshing
    event.preventDefault();
    const response = await fetch("http://localhost:3001/login", {
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
    console.log(data);
  }


  return (

    <div>
      <h1>
        Login
      </h1>
      <form onSubmit={loginUser}>
        <input 
          type="text" 
          placeholder="username" 
          onChange={(event) => {setUsername(event.target.value)}}
        /><br/>
        <input
          type="text"
          placeholder="password"
          onChange={(event) => {setPassword(event.target.value)}}
        /><br/>
        <button>Log In</button>
      </form>
    </div>


  )

}

export default App;
