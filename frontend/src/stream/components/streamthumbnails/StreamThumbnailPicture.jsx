import "./StreamThumbnailPicture.css"
import React, {Component} from "react"

class StreamThumbnailPicture extends Component {
    render() {
        return (
            <img src={this.props.src || "/assets/img/404.png"} className="responsive-image picfit" alt={this.props.alt || "404"}/>
        )
    }
}

export default StreamThumbnailPicture