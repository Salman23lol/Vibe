import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVusZDlInWZlzdKmQ1b4ATqxA4Hvo6xOc",
  authDomain: "vibe-52dd5.firebaseapp.com",
  projectId: "vibe-52dd5",
  storageBucket: "vibe-52dd5.appspot.com",
  messagingSenderId: "963252470715",
  appId: "1:963252470715:web:405ec3f10880bcfcb37a9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { storage };
