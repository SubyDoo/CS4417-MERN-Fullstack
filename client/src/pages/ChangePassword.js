
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

  
 const navigate = useNavigate()



 const [oldpassword, setOldPassword] = useState(""); 
 const [newpassword, setNewPassword] = useState("");
 const [confirmpassword, setConfirmPassword] = useState("");
 const[changePasswordResponse, setChangePasswordResponse] = useState("");


 async function changePassword(event){

    // prevent page from refreshing
    event.preventDefault();

    setChangePasswordResponse("");


    if(!oldpassword || !newpassword || !confirmpassword){
        setChangePasswordResponse("Please enter all fields");
    }

    else if (newpassword.length < 8 || newpassword.length > 16){
        setChangePasswordResponse("Password must be between 8-16 characters");
    }

    else if (newpassword !== confirmpassword){
        setChangePasswordResponse("New password and confirm passwords do not match");
    }

    else if(newpassword === confirmpassword){
        
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
              newpassword: newpassword
            })
          })
          
            const data = await response.json();
            
            //console.log(data);

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
        <input type="submit" value="Click to change password" />
    </form>
    </div>
  )
}

export default App;
