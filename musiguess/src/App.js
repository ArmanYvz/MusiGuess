import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./components/Login/Login.js";
import ResetPassword from "./components/ResetPassword/ResetPassword.js";
import Register from "./components/Register/Register.js";
import Home from "./components/Home/Home";
import Lobbies from "./components/Lobbies/Lobbies";
import Lobby from "./components/Lobby/Lobby";
import Game from "./components/Game/Game";
import GameResults from "./components/GameResults/GameResults";
import GameHistory from "./components/GameHistory/GameHistory";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/resetpassword" element={<ResetPassword />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/lobbies" element={<Lobbies />} />
          <Route exact path="/lobbies/:lobbyId" element={<Lobby/>} />
          <Route exact path="/game" element = {<Game />} />
          <Route exact path="/gameresults" element = {<GameResults />} />
          <Route exact path="/gamehistory" element = {<GameHistory />} />
          <Route path = "/*" element={<div>ERROR</div>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
