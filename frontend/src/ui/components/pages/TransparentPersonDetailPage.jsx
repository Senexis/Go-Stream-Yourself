import { getPeople } from "../../../transparentperson/actions/people"
import {connect} from "react-redux"
import {Row, Col, Container} from "react-materialize"
import React, { Component } from "react"
import StreamCardDeck from "../../../stream/components/streamcollections/StreamCardDeck"

class TransparentPersonDetailPage extends Component {
    componentDidMount() {
        if(this.props.people.length === 0) this.props.dispatch(getPeople())
    }
    render() {
        const person = this.props.people.filter((user) => user._id === this.props.match.params.id)[0] || {avatar:"/assets/img/404.png", user:"Unknown user", slogan: "User not found"}
        return (
            <Container>
                <Row>
                    <Col s={12} m={3} l={3}>
                        <br/>
                        <br/>
                        <img className="responsive-image picfit" style={{maxWidth: "100%"}} src={person.Avatar} alt=""/>
                    </Col>
                    <Col s={12} m={9} l={9}>
                        <h2>{person.Name}</h2>
                        <p>{person.Transparant?"This peron is a transparent person!":"This person is not a transparent person"}</p>
                        <p className="text-slogan">{person.Slogan}</p>
                        <p className="text-slogan">{person.BoisCoins || 0} BoisCoins</p>
                        <h2>Streams</h2>
                        <StreamCardDeck userspecific={person._id}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

function mapStateToProps(store) {
    return {people: store.people.people, dispatch: store.dispatch}
}
export default connect(mapStateToProps)(TransparentPersonDetailPage)
