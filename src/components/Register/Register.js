import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import "./Register.css";

//import Loading from "../Loading";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  //const [showLoading, setShowLoading] = useState(false);

  const register = async() => {
    //setShowLoading(true);
    if (!name){
      //setShowLoading(false);
      alert("Please enter name");
    }
    else {
      await registerWithEmailAndPassword(name, email, password);
      //setShowLoading(false);
    }
    
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate.replace("/");
  }, [user, loading]);
  return (
    <>
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nickname"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <div>
          Already have an account? <Link to="/"><a>Login</a></Link> now.
        </div>
      </div>
    </div>
    </>
  );
}
export default Register;