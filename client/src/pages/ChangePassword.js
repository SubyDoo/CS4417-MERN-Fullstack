
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar"; 

function App() {
  
  // allow to navigate to another page
  const navigate = useNavigate()

  // these states are for the change password form
  const [oldpassword, setOldPassword] = useState(""); 
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  // this state is for the change password response
  const[changePasswordResponse, setChangePasswordResponse] = useState("");

  // change password function
  async function changePassword(event){

    // prevent page from refreshing
    event.preventDefault();
    // reset the change password response
    setChangePasswordResponse("");

    // check if all fields are filled
    if(!oldpassword || !newpassword || !confirmpassword){
      setChangePasswordResponse("Please enter all fields");
    }

    // check if password is between 8-16 characters
    else if (newpassword.length < 8 || newpassword.length > 16){
      setChangePasswordResponse("Password must be between 8-16 characters");
    }

    // check if new password and confirm password match
    else if (newpassword !== confirmpassword){
      setChangePasswordResponse("New password and confirm passwords do not match");
    }

    // check if new password and confirm password match
    else if(newpassword === confirmpassword){
        
      // send request to server to change password
      const response = await fetch("https://localhost:3001/updatepassword", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          // telling the server we are sending JSON
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem("token")
        },
        body: JSON.stringify({
          oldpassword: oldpassword,
          newpassword: newpassword,
          confirmpassword: confirmpassword
        })
      })
        
      // get response
      const data = await response.json();

      if (data.status === "ok"){
        setChangePasswordResponse("Password Changed");
      }

      else if (data.status === "error"){
        if(data.error === "Incorrect Password"){
          setChangePasswordResponse("Incorrect Password");
        }
      }

      else {
        setChangePasswordResponse("Password Change Failed");
      }
    }  
  }

  // check if user is logged in, if not, redirect to login
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
        Change Password
      </h1>
      <form onSubmit={changePassword}>
        <label> Current Password </label><br/>
        <input type="password" name="oldpassword" onChange={(event) => {setOldPassword(event.target.value)}}/><br/>
        <label> New Password </label><br/>
        <input type="password" name="newpassword" onChange={(event) => {setNewPassword(event.target.value)}}/><br/>
        <label> Confirm New Password </label><br/>
        <input type="password" name="newpasswordconfirm" onChange={(event) => {setConfirmPassword(event.target.value)}}/><br/>
        {changePasswordResponse === "Password Changed" && <p style={{color: "green"}}>{changePasswordResponse}</p>}
        {changePasswordResponse === "Please enter all fields" && <p style={{color: "red"}}>{changePasswordResponse}</p>}
        {changePasswordResponse === "Password must be between 8-16 characters" && <p style={{color: "red"}}>{changePasswordResponse}</p>}
        {changePasswordResponse === "New password and confirm passwords do not match" && <p style={{color: "red"}}>{changePasswordResponse}</p>}
        {changePasswordResponse === "Incorrect Password" && <p style={{color: "red"}}>{changePasswordResponse}</p>}
        {changePasswordResponse === "Password Change Failed" && <p style={{color: "red"}}>{changePasswordResponse}</p>}
        <button>Click to change password</button>
      </form>
    </div>
  )
}

export default App;