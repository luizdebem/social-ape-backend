const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./socialape-6ffab-cc683a501810.json');

const app = require('express')();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-6ffab.firebaseio.com"
});

const firebaseConfig = {
  apiKey: "AIzaSyA-XB4ih9K1wzx2XITcB44_3ZHNI_9cRCY",
  authDomain: "socialape-6ffab.firebaseapp.com",
  databaseURL: "https://socialape-6ffab.firebaseio.com",
  projectId: "socialape-6ffab",
  storageBucket: "socialape-6ffab.appspot.com",
  messagingSenderId: "684740821979",
  appId: "1:684740821979:web:4a769a7b053fe0fa68ddfe"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
  db.collection('screams').orderBy('createdAt', 'desc').get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong.' });
      console.error(err);
    });
});

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  }

  db
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully.` });
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong.' });
      console.error(err);
    });
});

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
}

// Signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  }

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty.';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address.';
  }

  if (isEmpty(newUser.password)) errors.password = 'Must not be empty.';
  if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match.';
  if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty.';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);


  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'This handle is already taken.' })
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        .then(() => {
          return res.status(201).json({ token: token });
        })
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' })
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Must not be empty.';
  if (isEmpty(user.password)) errors.password = 'Must not be empty.';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'Wrong credentials.' });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.region('us-east1').https.onRequest(app);