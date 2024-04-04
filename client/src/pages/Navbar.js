
import React from "react";

// logout user
async function logoutUser(event){
    // prevent page from refreshing
    localStorage.removeItem("token")
    window.location.href = "/login"
}


// navigation bar to navigate to different pages
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