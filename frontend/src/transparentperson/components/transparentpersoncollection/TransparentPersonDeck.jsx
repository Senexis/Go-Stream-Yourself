import { CSSTransition, TransitionGroup } from "react-transition-group"
import { getPeople } from "../../actions/people"
import {connect} from "react-redux"
import {Row, Col} from "react-materialize"
import React, { Component } from "react"
import TransparentPersonThumbnail from "../transparentpersonthumbnails/TransparentPersonThumbnail"

class TransparentPersonDeck extends Component {
    componentWillMount() {
        this.props.dispatch(getPeople())
    }
    render() {
        return (
            <Row>
                <div className="progress" style={{visibility: this.props.people.fetching? "visible": "hidden"}}>
                    <div className="indeterminate"></div>
                </div>
                <TransitionGroup>
                        {this.props.people.people.map(item =>
                            <CSSTransition key={item._id} timeout={500} classNames="fade">
                                <Col s={12} m={4} l={3} key={item._id}> 
                                    <TransparentPersonThumbnail person={item}/>
                                </Col>
                            </CSSTransition>
                        )}
                </TransitionGroup>
            </Row>
        )
    }
}

function mapStateToProps(store) {
    return store
}
export default connect(mapStateToProps)(TransparentPersonDeck)
