import React, { Fragment } from "react";
import { NavLink as RRNavLink } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
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
          <NavItem>
            <NavLink tag={RRNavLink} exact to={ROUTES.ADMIN}>
              Admin
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

const NavigationNonAuth = () => (
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
    </Navbar>
  </Fragment>
);

export default Navigation;
