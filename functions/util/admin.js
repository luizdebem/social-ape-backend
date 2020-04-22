const admin = require('firebase-admin');
const serviceAccount = require('../socialape-6ffab-cc683a501810.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-6ffab.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };