
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" exact element={<Login/>} />
                    <Route path="/register" exact element={<Register/>} />
                    <Route path="/feedback" exact element={<Feedback/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App