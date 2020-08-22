import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBkRN0PfDoVVy00O2yYIW4HZw6uKUz6sYU",
    authDomain: "interruptradio-9282a.firebaseapp.com",
    databaseURL: "https://interruptradio-9282a.firebaseio.com",
    projectId: "interruptradio-9282a",
    storageBucket: "interruptradio-9282a.appspot.com",
    messagingSenderId: "371370271479",
    appId: "1:371370271479:web:e75b51e17642457d53a9f2",
    measurementId: "G-RP4SMBNVJF"
}

firebase.initializeApp(firebaseConfig)
export default firebase
export const database = firebase.firestore()
export const auth = firebase.auth()