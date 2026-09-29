import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCzlG9etVvu2oN8BYjV5fRzpErSokq11wE",
    authDomain: "koneko-bcbe9.firebaseapp.com",
    projectId: "koneko-bcbe9",
    storageBucket: "koneko-bcbe9.firebasestorage.app",
    messagingSenderId: "335436791269",
    appId: "1:335436791269:web:f64149c45595995cc3430c"
};

const app = getApps().some(({ name }) => name === "[DEFAULT]")
    ? getApp()
    : initializeApp(firebaseConfig);

export const messagingPromise = isSupported().then((supported) => (
    supported ? getMessaging(app) : null
));

export default app;
