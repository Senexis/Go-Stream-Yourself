import React, {Component} from "react"
import StreamThumbnail from "../streamthumbnails/StreamThumbnail"
import {Row, Col} from "react-materialize"
import {connect} from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import "./StreamCardDeck.css"


class StreamCardDeck extends Component {
    render() {
        return (
            <Row>
                <div className="progress" style={{visibility: this.props.fetching ? "visible": "hidden"}}>
                    <div className="indeterminate"></div>
                </div>
                <TransitionGroup>
                    {this.props.streams
                        .filter(stream => stream.Live || this.props.userspecific !== undefined)
                        .filter(stream => this.props.userspecific === undefined || this.props.userspecific === stream.User._id)
                        .filter(stream => {
                            return stream.User.Name.trim().toLowerCase().includes(this.props.searchword.trim().toLowerCase()) || stream.User.Slogan.trim().toLowerCase().includes(this.props.searchword.trim().toLowerCase())
                        })
                        .sort((a,b) => {
                            switch(this.props.page) {
                                default: 
                                    return 0
                                case "popular":
                                    return a.Viewers < b.Viewers
                                case "discover":
                                    return 0.5 - Math.random()
                            }
                        })
                        .map((item) =>
                            <CSSTransition key={item._id} timeout={500} classNames="fade">
                                <Col s={12} m={6} l={3}> 
                                    <StreamThumbnail stream={item}/>
                                </Col>
                            </CSSTransition>
                    )}
                </TransitionGroup>
            </Row>
        )
    }
}

function mapStateToProps(store) {
    return {streams: store.streams.streams, searchword: store.streams.searchword, fetching: store.streams.fetching}
}
export default connect(mapStateToProps)(StreamCardDeck)
