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
        <div class="login-main-container">
            <div class="header header-container">
                <h1 class="headerText">MusiGuess</h1>
                <h4 class="headerText2">Login to challenge your music repertoire!</h4>
            </div>
            <div class="container login-container">
                <input
                    type="text"
                    class="textBox-login"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <input
                    type="password"
                    class="textBox-login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    class="btn-login"
                    onClick={handleLoginButtonClickEmail}
                >
                    Login
                </button>
                <button class="btn-login google-login" onClick={signInWithGoogle}>
                    Login with Google
                </button>
                <div>
                    <Link to="/resetpassword"><a>Forgot Password</a></Link>
                </div>
                <div>
                    Don't have an account? <Link to="/register"><a>Register</a></Link> now.
                </div>
            </div>
        </div>
        </>
    );
}
export default Login;