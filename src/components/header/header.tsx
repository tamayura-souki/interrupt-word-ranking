import React, { useContext } from 'react'
import {
  Navbar, NavbarBrand, Nav, NavItem, NavLink
} from 'reactstrap'

import {AuthContext} from '../../contexts/Auth'

const Header = () => {
  const {currentUser, signout, signin}:any = useContext(AuthContext)
  const signButton = currentUser
    ? <NavLink onClick={signout}>Sign Out</NavLink>
    : <NavLink href="/sign-in">Sign In</NavLink>

  return (
    <header>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">InterruptRadio</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/">Ranking</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/words">Words</NavLink>
          </NavItem>
          <NavItem>
            {signButton}
          </NavItem>
        </Nav>
      </Navbar>
    </header>
  )
}

export default Header