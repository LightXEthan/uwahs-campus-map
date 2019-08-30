import React, { Component } from "react";
import app from "firebase/app";
import "firebase/auth";

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
class Firebase extends Component {
  constructor() {
    super();
    app.initializeApp(config);

    this.auth = app.auth();
  }
}

export default Firebase;
