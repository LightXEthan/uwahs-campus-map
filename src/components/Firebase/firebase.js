import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/firebase-storage";

require("dotenv").config();

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
};
class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();

    this.db = app.firestore();

    this.storage = app.storage();
  }

  // *** Points of interest Firestore database references ***
  // Points of interest firestore database
  poi = () => this.db.collection("poi").doc();

  // Collection reference
  pois = () => this.db.collection("poi");

  // Updating poi reference, input document id
  poiUpdate = poiid => this.db.collection("poi").doc(poiid);

  // Deletes the poi, input document id
  poiDelete = poiid => this.db.collection("poi").doc(poiid).delete();

  // References the files collection
  files = () => this.db.collection("files");

  // Updating the specific file metadata document, input document id
  fileUpdate = fileid => this.db.collection("files").doc(fileid);

  // *** Auth API from Firebase Authentication ***

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => 
    this.auth.signOut();

  doPasswordReset = email => 
    this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

}

export default Firebase;
