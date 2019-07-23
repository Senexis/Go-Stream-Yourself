import React, { Component } from "react"
import {Container, Row, Col} from "react-materialize"
import {connect} from "react-redux"
import TransparentPersonDeck from "../../../transparentperson/components/transparentpersoncollection/TransparentPersonDeck"

class TransparentPersonPage extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col l={12}>
                        <h2>Users</h2>
                        <p>Any person with a "✔" is a transparent person.</p>
                    </Col>
                </Row>
                <Row>
                    <TransparentPersonDeck/>
                </Row>
            </Container>
        )
    }
}

function mapStateToProps(store) {
    return store
}
export default connect(mapStateToProps)(TransparentPersonPage)
