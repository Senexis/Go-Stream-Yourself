import "./StreamContainer.css"
import {connect} from "react-redux"
import ChatBoxContainer from "../../../chat/components/chatboxcontainer/ChatBoxContainer"
import ChatInput from "../../../chat/components/chatinput/ChatInput"
import React, {Component} from "react"
import StreamVideo from "../streamvideo/StreamVideo"

class StreamContainer extends Component {
    render() {
        return (
            <div className="streamcontainer">
                <StreamVideo stream={this.props.stream}/>
                <ChatBoxContainer stream={this.props.stream}/>
                <ChatInput stream={this.props.stream}/>
                <div className="handle center" style={{color: "black", width:"100%"}}>:::::::</div>
            </div>
        )
    }
}

function mapStateToProps(store) {
    return store
}
export default connect(mapStateToProps)(StreamContainer)