import React, {Component} from "react"
import ChatMessage from "../../../chat/components/chatmessage/ChatMessage"
import { Button } from "react-materialize"

class ChatBoxContainer extends Component {
    constructor() {
        super()
        this.state = {
            loadHistory: false
        }
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" })
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    render() {
        return (
            <div>
                <ul id="chat-messages" className="collection" style={{overflowY: "scroll", margin: "0", maxHeight: "230px"}}>
                    {!this.state.loadHistory && this.props.stream.messages.length > 50
                        ? <li className="collection-item center"><Button onClick={() => this.setState({loadHistory: true})}>Load history</Button></li>
                        : null
                    }
                    {this.state.loadHistory
                        ? this.props.stream.messages.map((item, key) => <ChatMessage key={key} message={item} />)
                        : this.props.stream.messages.slice(Math.max(this.props.stream.messages.length - 50, 1)).map((item, key) => <ChatMessage key={key} message={item} />)
                    }
                    <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el }}></div>
                    <span ref={"bottom_"+this.props.stream.ID} style={{height: "100px"}}></span>
                </ul>
            </div>
        )
    }
}

export default ChatBoxContainer