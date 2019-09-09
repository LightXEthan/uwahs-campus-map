import React, { Component, Fragment } from "react";
import { NavLink as RRNavLink } from "react-router-dom";

import SignOutButton from '../SignOut';
import * as ROUTES from "../../constants/routes";

import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from "reactstrap";

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Navbar color="light" expand="md">
          <NavbarBrand tag={RRNavLink} exact to={ROUTES.MAP}>
            Map
          </NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink tag={RRNavLink} exact to={ROUTES.ABOUT}>
                About
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <SignOutButton />
            </NavItem>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }
}

export default Navigation;
