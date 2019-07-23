import React, { Component } from "react"
import {Link} from "react-router-dom"
import {Col, Row} from "react-materialize"
import Logout from "./Logout"

class Header extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Row>
            <Col l={2} s={0} m={0}/>
            <Col l={10} s={12} m={12}>
              <Link id="logo-container" to="/" className="brand-logo vertical-align-center">
                <img src="/assets/img/favicon-32x32.png" className="vertical-middle gsy-logo" alt=""/>
                <span className="vertical-middle hide-on-med-and-down">GoStreamYourself</span>
              </Link>
              <ul className="right hide-on-med-and-down">
                <li><Link to="/">Streams</Link></li>
                <li><Link to="/people">Users</Link></li>
                <li><Logout/></li>
              </ul>
              <ul id="nav-mobile" className="sidenav">
                <li><Link to="/">Streams</Link></li>
                <li><Link to="/people">Users</Link></li>
                <li><Logout/></li>
              </ul>
              <a
              // eslint-disable-next-line 
              href="javascript:void(0)" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            </Col>
          </Row>
        </div>
      </nav>
      )
  }
}

export default Header
