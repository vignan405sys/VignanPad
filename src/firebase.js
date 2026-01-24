// Firebase configuration
// Replace with your own Firebase project config from console.firebase.google.com
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCH4Ijp4l0xf4UXpzxeXml8HXDPLPH1PSg",
    authDomain: "vignanpad.firebaseapp.com",
    projectId: "vignanpad",
    storageBucket: "vignanpad.firebasestorage.app",
    messagingSenderId: "903092439725",
    appId: "1:903092439725:web:f1f4f9e5a7780575e25424",
    measurementId: "G-1K8YWXNQMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

