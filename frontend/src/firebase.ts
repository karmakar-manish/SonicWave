import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD3gPT4NC7oeXq8clhlfgg31m_YWzz7T50",
  authDomain: "sonicwave-605a5.firebaseapp.com",
  projectId: "sonicwave-605a5",
  storageBucket: "sonicwave-605a5.firebasestorage.app",
  messagingSenderId: "803223581352",
  appId: "1:803223581352:web:b2a295395a457da5ad489d"
};


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }