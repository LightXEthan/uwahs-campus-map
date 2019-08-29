import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import SignInPage from "../SignIn";
import AdminPage from "../Admin";
import PasswordForgetPage from "../PasswordForget";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const App = () => (
  <Router>
    <Fragment>
      <Navigation />
      
  </Fragment>
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
    </Fragment>
  </Router>
);

// export default withFirebase(App);
export default App;
