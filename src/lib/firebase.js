/**
 * Created by axetroy on 17-5-20.
 * help information: https://firebase.google.com/docs/web/setup
 */
import firebase from 'firebase/firebase-browser';

const config = {
  apiKey: 'AIzaSyDTCaJ23z7O393k_5w79z40XBNVURiAxb8',
  authDomain: 'blog-9281a.firebaseapp.com',
  databaseURL: 'https://blog-9281a.firebaseio.com',
  projectId: 'blog-9281a',
  storageBucket: 'blog-9281a.appspot.com',
  messagingSenderId: '989620354189'
};

const user = {
  email: 'troy450409405@gmail.com',
  password: '123123'
};

const app = firebase.initializeApp(config);

function main() {
  return app;
}

export function init(callback) {
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(function() {
      callback();
    })
    .catch(function(err) {
      callback(err);
    });
}

export default main();
