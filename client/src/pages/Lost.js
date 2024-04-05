
//import './App.css';
// useState hook - rerenders template when a reactive value is updated
// useEffect hook - runs right when the site is loaded
import {useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function App() {

  // allow to navigate to another page   
  const navigate = useNavigate()

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

  // function to go to feedback page
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