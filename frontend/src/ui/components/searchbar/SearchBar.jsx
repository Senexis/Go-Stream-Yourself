import React, { Component } from "react"
import { Input } from "react-materialize"
import {connect} from "react-redux"
import {searchStreams} from "../../../stream/actions/streams"

class SearchBar extends Component {
    render() {
        return (
            <Input s={12} m={12} l={12} defaultValue={this.props.streams.searchword} placeholder="Search an item" onKeyUp={(e) => {this.props.dispatch(searchStreams(e.target.value))} } />
        )
    }
}

function mapStateToProps(store) {
    return store
}
export default connect(mapStateToProps)(SearchBar)

