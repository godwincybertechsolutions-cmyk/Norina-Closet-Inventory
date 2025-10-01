<script type="module">
  // Firebase imports
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

  // Your Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBI6wqACD0sN5672pvNMCSZ-ErqQeYKo9A",
    authDomain: "inventory-29e94.firebaseapp.com",
    projectId: "inventory-29e94",
    storageBucket: "inventory-29e94.appspot.com",
    messagingSenderId: "1076150778714",
    appId: "1:1076150778714:web:6088889660ec3cac7dd163"
  };

  // Init Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
</script>
