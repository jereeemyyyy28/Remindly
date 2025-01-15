// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALjq7d3o-bOl1tWV-hxrifd9zUi7dU1gc",
    authDomain: "remindly-69f3f.firebaseapp.com",
    projectId: "remindly-69f3f",
    storageBucket: "remindly-69f3f.firebasestorage.app",
    messagingSenderId: "26192528228",
    appId: "1:26192528228:web:63e646f9c1cfaef6d6b071"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
