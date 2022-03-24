import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import './App.css';

import Login from "./components/Login/Login.js";
import ResetPassword from "./components/ResetPassword/ResetPassword.js";
import Register from "./components/Register/Register.js";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path = "/" element = {<Login/>} />
          <Route exact path = "/resetpassword" element = {<ResetPassword/>} />
          <Route exact path = "/register" element = {<Register/>} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
