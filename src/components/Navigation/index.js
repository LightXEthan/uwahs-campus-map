import React, { Component, Fragment } from "react";
import { NavLink as RRNavLink } from "react-router-dom";

import SignOutButton from '../SignOut';
import * as ROUTES from "../../constants/routes";

import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
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
