import axios from "../../axios"
import React, { Component } from "react"
import crypto from "crypto"
import {Row, Col, Input} from "react-materialize"
import { connect } from "react-redux"
import {authenticate, testToken} from "../actions/user"

class Login extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  componentWillMount() {
    if(window.localStorage.getItem("_token") && window.localStorage.getItem("_certificate")) {
      this.props.dispatch(testToken())
    } else {
      window.localStorage.clear()
    }
  }
  handleFile(token, name, contents) {
    if (token && name && contents) {
      let sign = crypto.createSign("RSA-SHA256")
      sign.write(JSON.stringify({token: token}))
      sign.end()

      try {
        let signature = sign.sign(contents, "hex")

        let headers = {
          "Signature": signature,
          "Token": token,
          "Name": name
        }

        this.props.dispatch(authenticate(headers, {name: name, token: token, contents: contents}))
      } catch (err) {
        alert("The uploaded file was not a key file.")
        window.localStorage.clear()
      }
    } else { 
      window.localStorage.clear()
      alert("Not all data was entered.")
    }
  }

  handleSubmit(event) {
    event.persist()
    event.preventDefault()
    if(window.localStorage.getItem("_username") !== event.target.user.value) window.localStorage.setItem("_username", event.target.user.value)

    const _self = this
    axios.get("/login", {headers: null, forceUpdate: true})
      .then(function (response) {
        let token = response.headers.token || response.headers["token"]
        let name = event.target.user.value || window.localStorage.getItem("_username")

        let contents = window.localStorage.getItem("_certificate")
        let file = event.target.file.files[0]

        if (contents === null && file) {
          let reader = new FileReader()
          reader.onload = function(e) {
            contents = e.target.result
            _self.handleFile(token, name, contents)
          }
          reader.readAsText(file)
        } else if (contents !== null) {
          _self.handleFile(token, name, contents)
        } else {
          alert("Not all data was entered.")
          localStorage.clear()
        }
      })
      .catch(function (error) {
        alert("An error has occured during token retrieval.\n" + error.message)
        localStorage.clear()
      })
  }

  render() {
    return (
      <div className="section">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Input name="user" placeholder="Enter your name…" s={12} label="User" validate />
          </Row>
          <Row>
            <div className="file-field input-field col s12">
              <div className="btn waves-effect waves-light">
                <span><i className="material-icons">add</i></span> 
                <input id="file" type="file" />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="Please select your key…" />
              </div>
            </div>
          </Row>
          <Row>
            <Col s={12}>
              <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                  <i className="material-icons right">cloud</i>
              </button>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return store
}
export default connect(mapStateToProps)(Login)