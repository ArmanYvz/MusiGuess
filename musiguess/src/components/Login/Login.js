import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

//import Loading from "../Loading";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    //const [showLoading,setShowLoading] = useState(false);

    const handleLoginButtonClickEmail = async() =>{
        //setShowLoading(true);
        await signInWithEmailAndPassword(email, password);
        //setShowLoading(false);
    }

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/Home", {replace: true});
        }
    }, [user, loading]);
    return (
        <>
        <div className="login-main-container">
            <div className="header-container">
                <div className="headerTextLogo">
                    <h1 className="headerTextLogoLeft noselect" >Musi</h1>
                    <h1 className="headerTextLogoRight noselect">Guess</h1>
                </div>
            </div>

            
            <div className="container login-container">
                <input
                    type="text"
                    className="textBox-login"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <input
                    type="password"
                    className="textBox-login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    className="btn-login"
                    onClick={handleLoginButtonClickEmail}
                >
                    Login
                </button>
                <button className="btn-login google-login" onClick={signInWithGoogle}>
                    Login with Google
                </button>
                <div className ="login-container__footer">
                    <p>
                        <Link to="/resetpassword"><span>Forgot Password </span></Link>
                        <br/>
                        Don't have an account?
                        <Link to="/register"><span> Register </span></Link>
                        now.
                    </p>
        
                </div>
            </div>
            <h3 className="headerText2">Login to challenge your music repertoire!</h3>
        </div>
        </>
    );
}
export default Login;