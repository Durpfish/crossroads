import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAC5SxUZV2m7r5CUdru54FqjKl4N9LKla4",
    authDomain: "crossroads-cb.firebaseapp.com",
    projectId: "crossroads-cb",
    storageBucket: "crossroads-cb.appspot.com",
    messagingSenderId: "350698148646",
    appId: "1:350698148646:web:40670b4732f7bfcb3a27e7"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);