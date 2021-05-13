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

// Firestore exports 
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
// dzieki temu mozna sie dowiedziec jaki jest status uploadu plikow
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

//pobiera dokument uzytkownika przez username
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

//konwertuje dokument firestore na json
export function postToJSON(doc) {
  const data = doc.data();

  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
