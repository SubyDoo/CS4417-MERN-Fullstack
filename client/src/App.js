
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import Lost from "./pages/Lost";
import ChangePassword from "./pages/ChangePassword";
import NavBar from "./pages/Navbar"

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" exact element={<Login/>} />
                    <Route path="/register" exact element={<Register/>} />
                    <Route path="/feedback" exact element={<Feedback/>} />
                    <Route path="/changepassword" exact element={<ChangePassword/>} />
                     {/* All other routes go to the login page */}
                    <Route path="*" exact element={<Lost/>} />
                </Routes>
            </BrowserRouter>
        </div>

    )
}

export default App