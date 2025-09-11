// Import the functions you need from the SDKs you need
import { initializeApp,getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import 'firebase/auth';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const config = {
  apiKey: "AIzaSyA4YJGuYX1gH2Alg46ELUmFZoSECD8g7ik",
  authDomain: "development-382105.firebaseapp.com",
  projectId: "development-382105",
  storageBucket: "development-382105.appspot.com",
  messagingSenderId: "234636235499",
  appId: "1:234636235499:web:8060d54ef9ee9ac0bce4ae",
  databaseURL:
    "https://development-382105-default-rtdb.asia-southeast1.firebasedatabase.app",

};

const app = initializeApp(config);

const firebaseConfig = () => {
  const databaseApp = initializeApp(config);
  return getDatabase(databaseApp)
};
export default firebaseConfig;


export const firebase_app = getApps().length === 0 ? initializeApp(config) : getApps()[0];

export const firebaseStorage = getStorage(app)
export const firebaseDatabaseConn = getStorage(app)