// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY3hZhcCPvZ8U9lfTUL1McZwiVvq5gdoU",
  authDomain: "alhaqlearning.firebaseapp.com",
  projectId: "alhaqlearning",
  storageBucket: "alhaqlearning.firebasestorage.app",
  messagingSenderId: "279483310941",
  appId: "1:279483310941:web:b7bbc177d48dd8a578feb4",
  measurementId: "G-BXJPMJJ48P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);