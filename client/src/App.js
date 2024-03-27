
import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import Axios from "axios";


function App() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // api call to get a full list of users and set into listOfUsers variable, this will run at page load
  useEffect(() => {
    Axios.get("http://localhost:3001/getUsers").then((response) => {
      setListOfUsers(response.data);
    }) .catch((error) => {
      console.error("Error fetching users:", error);
    });
  }, []);

  
  const createUser = () => {
    Axios.post("http://localhost:3001/createUser", {
      username: username, 
      password: password
    }).then((response =>{
      //alert("User created");
      // adding to the list of users displayed
      setListOfUsers([...listOfUsers, 
        {
          username, 
          password}])
    }))
  }; 


  return (
    <div className="App">
      <div className="usersDisplay">
      {/* creating divs for each user in listOfUsers to display*/}
        <div><h1>Test Title</h1></div>
        {listOfUsers.map((user)=>{
            return (
            <div> 
              <h1>username: {user.username}</h1>
              <h1>password: {user.password}</h1>
            </div>
        );
        })}
      </div> 

      <div>
        <input type = "text" 
          placeholder='Username' 
          onChange={(event) => {
            setUsername(event.target.value)
          }}
        />

        <input type = "text" 
          placeholder='Password' 
          onChange={(event) => {
            setPassword(event.target.value)
          }}
        />

        <button onClick={createUser}> Create User </button> 
      </div>

    </div>
  );
}

export default App;
