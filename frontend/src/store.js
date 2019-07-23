import {applyMiddleware, createStore, compose} from "redux"

import promise from "redux-promise-middleware"

import reducer from "./reducers"

const middleware = compose( 
    applyMiddleware(promise()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)

export default createStore(reducer, middleware)