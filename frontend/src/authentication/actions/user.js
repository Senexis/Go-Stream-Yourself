import axios from "../../axios"

export function addStreamToUser(stream, x=0, y=0){
    return {
        type: "ADD_STREAM",
        payload: {stream: stream, x: x, y: y}
    }
}

export function removeStreamFromUser(stream){
    return {
        type: "REMOVE_STREAM",
        payload: {stream: stream}
    }
}

export function login(userdata, token) {
    return {
        type: "USER_LOGIN",
        meta: {
            username: userdata,
            token: token
        }
    }
}

export function authenticate(headers, meta) {
    return {
        type: "USER_AUTHENTICATE",
        payload: axios.get("/login", {headers: headers, forceUpdate: true}),
        meta: meta
    }
}

export function testToken() {
    return {
        type: "USER_AUTHENTICATE_CHECK",
        payload: axios.get("/token")
    }
}

export function getUserData(username) {
    return {
        type: "FETCH_USERDATA",
        payload: axios.get("/users/"+username)
    }
}

export function logout() {
    return {
        type: "USER_LOGOUT"
    }
}