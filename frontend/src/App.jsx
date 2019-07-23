import "./App.css"
import { getStreams } from "./stream/actions/streams"
import { getUserData } from "./authentication/actions/user"
import { Switch, Route, withRouter } from "react-router-dom"
import {connect} from "react-redux"
import Footer from "./ui/components/Footer"
import Header from "./ui/components/Header"
import LoginPage from "./ui/components/pages/LoginPage"
import React, { Component } from "react"
import StreamPage from "./ui/components/pages/StreamPage"
import StreamPageContainer from "./stream/components/streamcontainer/StreamPageContainer"
import TransparentPersonDetailPage from "./ui/components/pages/TransparentPersonDetailPage"
import TransparentPersonPage from "./ui/components/pages/TransparentPersonPage"

class App extends Component {
  interval = null

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated && !nextProps.user.Name) {
      this.props.dispatch(getUserData(localStorage.getItem("_username")))
      this.props.dispatch(getStreams())
    }
  }
  
  componentDidMount() {
    this.interval = setInterval(() => this.props.dispatch(getStreams()), 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <StreamPageContainer/>
        <Header/>
        <Switch>
          <Route exact path="/loginPage" component={(props) => <LoginPage {...props} />}/>
          <Route path="/people/:id" component={(props) => this.props.authenticated ? <TransparentPersonDetailPage {...props} /> : <LoginPage/>}/> 
          <Route exact path="/people" component={() => this.props.authenticated ? <TransparentPersonPage /> : <LoginPage/>}/>
          <Route path="/:subpage" component={(props) => this.props.authenticated ? <StreamPage { ...props}/> : <LoginPage/>}/>
          <Route path="/" component={(props) => this.props.authenticated ? <StreamPage {...props} /> : <LoginPage/>}/>
        </Switch>
        <Footer/>
      </div>
    )
  }
}
function mapStateToProps(store) {
  return {authenticated: store.user.authenticated, user: store.user.user, dispatch: store.dispatch}
}
export default withRouter(connect(mapStateToProps)(App))