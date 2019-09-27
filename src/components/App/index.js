import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { withAuthentication } from "../Session";
import AuthUserContext from "../Session/context";

import MapPage from "../MapPage";
import Navigation from "../Navigation";
import SignInPage from "../SignIn";
import AdminPage from "../Admin";
import PasswordForgetPage from "../PasswordForget";
import * as ROUTES from "../../constants/routes";

const App = () => (
  <Router>
    <Fragment>
      <AuthUserContext.Consumer>
        {authUser => (authUser ? <Navigation /> : null)}
      </AuthUserContext.Consumer>
      <Route exact path={ROUTES.MAP} component={MapPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
    </Fragment>
  </Router>
);

export default withAuthentication(App);
