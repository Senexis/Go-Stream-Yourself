import "./StreamNavigation.css"
import { Link } from "react-router-dom"
import React, {Component} from "react"

class StreamNavigation extends Component {
    render() {
        return (
            <div>
                <ul className="collection">
                    <Link to="/" className="collection-item">
                        <p className={"SidemenuItem "+this.props.page===""?"active":null}>All</p>
                    </Link>
                    <Link to="/popular" className="collection-item">
                        <p className={"SidemenuItem "+this.props.page==="popular"?"active":null}>Popular</p>
                    </Link>
                    <Link to="/discover" className="collection-item">
                        <p className={"SidemenuItem "+this.props.page==="discover"?"active":null}>Discover</p>
                    </Link>
                </ul>
            </div>
        )
    }
}

export default StreamNavigation