import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, 
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

// function to sign in via Google
const signInWithGoogle = async() => {
    try {
        const res = await auth.signInWithPopup(googleProvider);
        const user = res.user;
        const query = await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get();
        if (query.docs.length === 0) {
          await db.collection("users").add({
              uid: user.uid,
              name: user.displayName,
              authProvider: "google",
              email: user.email,
          });
        }
        const query2 = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query2.docs[0].data();
        localStorage.setItem("userId", query2.docs[0].id);
        localStorage.setItem("userName", data.name);
    } catch (err) {
        console.log("api key: " + firebaseConfig.apiKey);
        console.error(err);
        alert(err.message);
    }
};

// function to sign in via email password
const signInWithEmailAndPassword = async (email, password) => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      const user = res.user; /*
      localStorage.setItem("userId", user.uid); */
      try {
        const query = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query.docs[0].data();
        localStorage.setItem("userId", query.docs[0].id);
        localStorage.setItem("userName", data.name);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// function to register via email password
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await db.collection("users").add({
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
      try {
        const query = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query.docs[0].data();
        localStorage.setItem("userId", query.docs[0].id);
        localStorage.setItem("userName", data.name);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    
};


// function that sends password reset email
const sendPasswordResetEmail = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// logout handler function
const logout = () => {
    auth.signOut();
    localStorage.setItem("userId", "");
    localStorage.setItem("userName", "");
};

export {
    auth,
    db,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    logout,
};