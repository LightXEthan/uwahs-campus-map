import React, { Fragment} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import MapPage from "../MapPage";
import AboutPage from "../About";
import Navigation from "../Navigation";
import SignInPage from "../SignIn";
import AdminPage from "../Admin";
import PasswordForgetPage from "../PasswordForget";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

const App = () => (
  <Router>
    <Fragment>
      <Navigation />
      <Route exact path={ROUTES.MAP} component={MapPage} />
      <Route path={ROUTES.ABOUT} component={AboutPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
    </Fragment>
  </Router>
);

export default withAuthentication(App);
