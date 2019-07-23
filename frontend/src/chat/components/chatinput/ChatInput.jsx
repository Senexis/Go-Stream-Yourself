import { sendMessage } from "../../../socket"
import {connect} from "react-redux"
import React, {Component} from "react"

class ChatInput extends Component {
    constructor() {
        super()
        this.handleEnter = this.handleEnter.bind(this)
    }
    handleEnter(event) {
        if(event.key === "Enter" && event.target.value.trim()){
            //this.props.dispatch(sendChatMessage(event.target.value.trim(), this.props.user.name, this.props.stream))
            sendMessage(event.target.value.trim(), localStorage.getItem("_username"), this.props.stream._id, this.props.user.user.PublicKey)
          event.target.value = ""
        }
      }
    render() {
        return (
            <div className="chat-send input-field">
                <input type="text" onKeyPress={this.handleEnter} id="message" className="materialize-textarea" data-length="120" placeholder="Say something..."></input>
            </div>
        )
    }
}

function mapStateToProps(store) {
    return store
}
export default connect(mapStateToProps)(ChatInput)