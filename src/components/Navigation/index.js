import React, { Component, Fragment } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Navbar color="light" expand="md">
          <NavbarBrand href="/">Landing</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="/somewhere over the rainbows blue birds fly">
                About
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }
}

export default Navigation;
