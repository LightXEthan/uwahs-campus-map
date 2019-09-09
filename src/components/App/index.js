import React, { Fragment, Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import MapPage from "../MapPage";
import AboutPage from "../About";
import Navigation from "../Navigation";
import SignInPage from "../SignIn";
import AdminPage from "../Admin";
import PasswordForgetPage from "../PasswordForget";
import * as ROUTES from "../../constants/routes";

import { withFirebase } from "../Firebase";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
    });
  }

  // remove listener to avoid memory leaks
  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <Router>
        <Fragment>
          <Navigation authUser={this.state.authUser} />
          <Route exact path={ROUTES.MAP} component={MapPage} />
          <Route path={ROUTES.ABOUT} component={AboutPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        </Fragment>
      </Router>
    );
  }
}

export default withFirebase(App);
