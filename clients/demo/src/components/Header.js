import React, { Component } from "react";
import { connect } from 'react-redux';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';
import { Link } from "react-router-dom";
import Notifications from 'react-notification-system-redux';

class Header extends Component {

    render() {
        return (
            <Navbar dark className="cblue" expand="md">
                <NavbarBrand tag={Link} to="/">Hopper</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Link className="btn btn-warning" to="/new/">New Idea</Link>
                    </NavItem>
                </Nav>
                <Notifications
                    notifications={this.props.notifications}
                />
            </Navbar>
        );
    }
};

export default connect(
  state => ({ notifications: state.notifications })
)(Header);

