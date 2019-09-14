import React, { Component } from "react";
import { Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from '../Firebase';
import * as ROUTES from "../../constants/routes";

class  SignOutButton extends Component {
    constructor(props){
        super(props);
    }

    handleSignOut = event => {    
        this.props.firebase.doSignOut()
        .then(() => {
            this.props.history.push(ROUTES.SIGN_IN);
        })
        .catch(error => {
            this.setState({ error });
        });
        event.preventDefault();
    };

    render() {
        return (
            <Button outline onClick={this.handleSignOut}>
              <span className="fa fa-sign-out fa-lg"></span> Sign Out
            </Button>
        );       
    }
}

const SignOut = compose(
    withRouter,
    withFirebase,
)(SignOutButton);

export default SignOut;

