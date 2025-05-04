// firebaseInit.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA1zvsiIXOmhYjhcFV1lL31yHWPmex6tP4",
    authDomain: "photofolio-41cbf.firebaseapp.com",
    projectId: "photofolio-41cbf",
    storageBucket: "photofolio-41cbf.appspot.com",
    messagingSenderId: "409649771008",
    appId: "1:409649771008:web:e75a7725879cad8fca5ee5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
