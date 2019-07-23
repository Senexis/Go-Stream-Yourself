import { combineReducers } from "redux"

import streams from "./stream/reducers/streams"
import user from "./authentication/reducers/user"
import people from "./transparentperson/reducers/people"

export default combineReducers({
    streams, user, people
})