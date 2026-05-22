// ================================================
//  AYUSHMAN PATIENT MGMT — firebase-config.js
//  Initialises Firebase (compat SDK, no bundler needed)
//  Must be loaded BEFORE auth.js and patients.js
// ================================================

const firebaseConfig = {
  apiKey:            "AIzaSyDOfkMvckJDRjVT7RKbtdDseYO9Zi9e3IE",
  authDomain:        "aayushman-bhava.firebaseapp.com",
  projectId:         "aayushman-bhava",
  storageBucket:     "aayushman-bhava.firebasestorage.app",
  messagingSenderId: "27366797357",
  appId:             "1:27366797357:web:ddb3072435aea51951c8a4",
  measurementId:     "G-DL85YG5NPG"
};

firebase.initializeApp(firebaseConfig);

// Expose shared instances so auth.js / patients.js can use them
window._fbAuth = firebase.auth();
window._fbDb   = firebase.firestore();
