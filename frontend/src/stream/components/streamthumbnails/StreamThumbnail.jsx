import "./StreamThumbnail.css"
import {addStreamToUser} from "../../../authentication/actions/user"
import {connect} from "react-redux"
import React, {Component} from "react"
import StreamThumbnailPicture from "./StreamThumbnailPicture"

class StreamThumbnail extends Component {
    render() {
        return (
            <div className="card openstream" onClick={(e) => this.props.dispatch(addStreamToUser(this.props.stream, e.target.x, e.target.y))}>
                <div className="card-image">
                    <StreamThumbnailPicture src={this.props.stream.User.Avatar} alt={"Avatar of "+this.props.stream.User.Name}/>
                </div>
                <div className="card-content">
                    <p className="text-title truncate">{this.props.stream.User.Name}</p>
                    <p className="text-slogan truncate">{this.props.stream.User.Slogan ? this.props.stream.User.Slogan : "No slogan."}</p>
                    <p className="text-muted truncate">{this.props.stream.Viewers} followers</p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(store) {
    return {dispatch: store.dispatch}
}
export default connect(mapStateToProps)(StreamThumbnail)