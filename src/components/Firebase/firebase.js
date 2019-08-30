import React from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
  }

  poi = poiid => this.db.doc(`poi/${poiid}`);

  pois = () => this.db.collection("poi");
}

export default Firebase;
