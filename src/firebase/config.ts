import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyAjszWl3DFsYq5zk6_1hzDFwPxhBtG4N64",
    authDomain: "badbar-90ab1.firebaseapp.com",
    projectId: "badbar-90ab1",
    storageBucket: "badbar-90ab1.appspot.com",
    messagingSenderId: "687287583044",
    appId: "1:687287583044:web:14abf92197b9acf7859711",
    measurementId: "G-2F4PWKQDN0"
  };
  
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);