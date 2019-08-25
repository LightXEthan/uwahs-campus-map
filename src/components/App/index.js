import React, { Component, Fragment } from "react";

import Navigation from "../Navigation";

import { withFirebase } from "../Firebase";

const App = () => (
  <Fragment>
    <Navigation />

    <h1>Hello Goodbye</h1>
  </Fragment>
);

// export default withFirebase(App);
export default App;
