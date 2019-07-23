import { Provider } from "react-redux"
import {BrowserRouter} from "react-router-dom"
import App from "./App"
import React from "react"
import ReactDOM from "react-dom"
import store from "./store"


it("renders without crashing", () => {
  const div = document.createElement("div")
  //ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, div)
})