import { Link } from "react-router-dom"
import React, { Component } from "react"

class TransparentPersonThumbnail extends Component {
    render() {
        return (
            <Link to={"/people/"+this.props.person._id}>
                <div className="card">
                    <div className="card-image">
                        <img className="responsive-image picfit" src={this.props.person.Avatar || "/assets/img/404.png"} alt=""/>
                    </div>
                    <div className="card-content">
                        <p className="text-title truncate" style={{fontSize: "1.15em", color: "#000"}}>{this.props.person.Name} {(this.props.person.Transparant ? " ✔" : "")}</p>
                    </div>
                </div>
            </Link>
        )
    }
}

export default TransparentPersonThumbnail