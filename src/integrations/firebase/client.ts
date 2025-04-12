
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD5O8hgGJPvbgHOEt_4UUiISCm4x_vsAIs",
  authDomain: "skillswap-app.firebaseapp.com",
  projectId: "skillswap-app",
  storageBucket: "skillswap-app.appspot.com",
  messagingSenderId: "753046463414",
  appId: "1:753046463414:web:3542ff88e83bdd2a7446dc",
  databaseURL: "https://skillswap-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
