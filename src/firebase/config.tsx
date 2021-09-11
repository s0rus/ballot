import firebase from 'firebase/app';
import 'firebase/firestore';

const app = !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: 'AIzaSyAUYeWTmYfJ6RUmm5HyxZSGeEpyzexFDmI',
      authDomain: 'ballot-96f0f.firebaseapp.com',
      projectId: 'ballot-96f0f',
      storageBucket: 'ballot-96f0f.appspot.com',
      messagingSenderId: '292244326414',
      appId: '1:292244326414:web:42bc27fd78e50e30a4d45f',
    })
  : firebase.app();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestore = app.firestore();
export default app;
