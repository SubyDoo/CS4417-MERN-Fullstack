
import React from "react";




async function logoutUser(event){
    // prevent page from refreshing
    localStorage.removeItem("token")
    window.location.href = "/login"
  }



const NavBar = () =>{
    return <nav className="nav">

        <a href="/feedback" className="site-home">Home</a>
        <ul>
            <li>
                <a href="/changepassword">Change Password</a>
            </li>
            <li>
                <button onClick={logoutUser}>Logout</button>
            </li>
        </ul>

    </nav>
    
}

export default NavBar