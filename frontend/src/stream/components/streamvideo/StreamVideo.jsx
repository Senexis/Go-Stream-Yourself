
import React, {Component} from "react"

class StreamVideo extends Component {
    render() {
        return (
            <iframe src={"http://145.49.53.161:" + this.props.stream.Port} frameBorder="0" style={{background: "#000"}}></iframe>
        )
    }
}

export default StreamVideo