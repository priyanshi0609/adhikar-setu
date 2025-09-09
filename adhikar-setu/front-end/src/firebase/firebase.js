// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAtITissxKURRVqYlw9a3jnufEj9kAp8I",
    authDomain: "adhikar-setu.firebaseapp.com",
    projectId: "adhikar-setu",
    storageBucket: "dhikar-setu.firebasestorage.app",
    messagingSenderId: "354640591300",
    appId: "1:354640591300:web:ba39a6861af8aceb1f8c91",
    measurementId: "G-GPV5YN9JFY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
