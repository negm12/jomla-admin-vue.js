// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDk2z6ogOAQznl63Sqnx7MUOQwVeJtSdc8",
  authDomain: "supermarket-1e36c.firebaseapp.com",
  databaseURL: "https://supermarket-1e36c-default-rtdb.firebaseio.com",
  projectId: "supermarket-1e36c",
  storageBucket: "supermarket-1e36c.appspot.com",
  messagingSenderId: "1062607830025",
  appId: "1:1062607830025:web:82ebf7cf6f54a7de510cd8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
