import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNBsIZfcd9ikZfePiyRSBJZjaoSXQlY2Q",
  authDomain: "nextfire-b2e41.firebaseapp.com",
  projectId: "nextfire-b2e41",
  storageBucket: "nextfire-b2e41.appspot.com",
  messagingSenderId: "559322092710",
  appId: "1:559322092710:web:8d3520c04540b213451067",
  measurementId: "G-PCY8SH8M7R",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
