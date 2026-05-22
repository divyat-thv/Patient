// ================================================
// AYUSHMAN PATIENT MGMT — firebase-config.js
// ================================================

const firebaseConfig = {

  apiKey: "AIzaSyDOfkMvckJDRjVT7RKbtdDseYO9Zi9e3IE",

  authDomain: "aayushman-bhava.firebaseapp.com",

  projectId: "aayushman-bhava",

  storageBucket: "aayushman-bhava.appspot.com",

  messagingSenderId: "27366797357",

  appId: "1:27366797357:web:ddb3072435aea51951c8a4",

  measurementId: "G-DL85YG5NPG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global objects
window._fbAuth = firebase.auth();

window._fbDb = firebase.firestore();
