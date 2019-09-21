import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged (
                authUser => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                // avoid showing protected page to non authenticated users before redirect happens
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization)
};

export default withAuthorization;