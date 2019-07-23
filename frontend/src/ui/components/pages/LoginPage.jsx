import { Row, Col, Container } from "react-materialize"
import Login from "../../../authentication/components/Login"
import React, { Component } from "react"

class LoginPage extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col l={12}>
                        <h1>Log in</h1>
                    </Col>
                </Row>
                <Login/>
            </Container>
        )
    }
}
export default LoginPage
