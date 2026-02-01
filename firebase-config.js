import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAmigODFK8R9c0-fWtagdxLWu9xkODfKYQ",
    authDomain: "masteroab-db5e1.firebaseapp.com",
    databaseURL: "https://masteroab-db5e1-default-rtdb.firebaseio.com",
    projectId: "masteroab-db5e1",
    storageBucket: "masteroab-db5e1.appspot.com",
    messagingSenderId: "620234160245",
    appId: "1:620234160245:web:d0ef18660600087f9ba03c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
