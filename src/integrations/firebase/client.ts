
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgqRyZfF1vT1QA83tQLg36jl9uFF8GToA",
  authDomain: "skill-swap-bea60.firebaseapp.com",
  databaseURL: "https://skill-swap-bea60-default-rtdb.firebaseio.com",
  projectId: "skill-swap-bea60",
  storageBucket: "skill-swap-bea60.firebasestorage.app",
  messagingSenderId: "689116908434",
  appId: "1:689116908434:web:ff60aaf7305788aa014f4b",
  measurementId: "G-NHFKEKVNR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db, analytics };
