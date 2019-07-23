export default function reducer(state = {
    openstreams: [],
    fetching: false,
    fetched: false,
    error: null,
    authenticated: false,
    user: {},
}, action){
    switch(action.type){
        // User authentication

        case "USER_AUTHENTICATE_FORCE": {
            return {...state, authenticated: true}
        }

        case "USER_AUTHENTICATE_PENDING": {
            return state
        }

        case "USER_AUTHENTICATE_REJECTED": {
            window.localStorage.removeItem("_certificate")
            window.localStorage.removeItem("_username")
            window.localStorage.removeItem("_token")
            alert("An error has occured during verification.\n" + action.payload)
            return {...state, authenticated: false}
        }

        case "USER_AUTHENTICATE_FULFILLED": { 
            window.localStorage.setItem("_certificate", action.meta.contents)
            window.localStorage.setItem("_username", action.meta.name)
            window.localStorage.setItem("_token", action.payload.headers.token)
            return {...state, authenticated: true}
        }

        case "ADD_STREAM": {
            if (state.openstreams.map(streamobject => streamobject.stream._id).filter(streamobject => streamobject === action.payload.stream._id).length >= 1) return state
            if (state.openstreams.length < 4) return {...state, openstreams: state.openstreams.concat({...action.payload, chattimestamp: 0})}
            else return state

            /* Hier moet iets van een melding die aangeeft dat je er maar 4 max mag hebben */
        }
        case "REMOVE_STREAM": {
            return {...state, openstreams: state.openstreams.filter((e) => e.stream._id !== action.payload.stream._id)}
        }

         // Retrieving chatmessages
         case "FETCH_STREAMCHAT_PENDING": {
            return {...state, fetching: true}
        }
        case "FETCH_STREAMCHAT_REJECTED": {
            return {...state, fetching: false, error: action.payload}
        }
        case "FETCH_STREAMCHAT_FULFILLED": {
            return {...state, fetching: false, fetched: true, streams: state.openstreams.map((stream) => {
                let streamitem = stream.stream
                if (streamitem._id === action.meta.stream._id) {
                    streamitem.messages = action.payload.data
                    //streamitem.messages = streamitem.messages.concat(action.payload.data)
                }
                //if(action.payload.headers.timestamp !== 0 && action.payload.headers.timestamp !== "0") streamitem.chattimestamp = action.payload.headers.timestamp
                return streamitem
            })}
        }

        case "CONCAT_STREAMCHAT": {
            return {...state, fetching: false, fetched: true, streams: state.openstreams.map((stream) => {
                let streamitem = stream.stream
                if (streamitem._id === action.meta.message.Stream) {
                    streamitem.messages.push(action.meta.message)
                    //streamitem.messages = streamitem.messages.concat(action.payload.data)
                }
                //if(action.payload.headers.timestamp !== 0 && action.payload.headers.timestamp !== "0") streamitem.chattimestamp = action.payload.headers.timestamp
                return streamitem
            })}
        }

        // checking token
        case "USER_AUTHENTICATE_CHECK_FULFILLED":
            return {...state, authenticated: true}

        case "USER_AUTHENTICATE_CHECK_REJECTED":
            localStorage.clear()
            return {...state, authenticated: false}

        // Sending chatmesssages
        case "SEND_STREAMCHAT_PENDING": {
            return {...state, fetching: true}
        }
        case "SEND_STREAMCHAT_REJECTED": {
            return {...state, fetching: false, error: action.payload}
        }
        case "SEND_STREAMCHAT_FULFILLED": {
            return {...state, fetching: false, fetched: true, streams: state.openstreams.map((stream) => {
                let streamitem = stream.stream
                if (streamitem._id === action.meta.stream._id) {
                    streamitem.messages.push({
                        User: {
                            Avatar: state.user.Avatar,
                            Name: state.user.Name,
                            Date: Date.now(),
                            IsTransparent: state.user.IsTransparent
                        }, 
                        Content: action.meta.message,
                    })
                }
                return streamitem
            })}
        }

        case "FETCH_USERDATA_PENDING":
            return state
        
        case "FETCH_USERDATA_REJECTED":
            return state

        case "FETCH_USERDATA_FULFILLED":
            return {...state, user: action.payload.data}

        case "USER_LOGOUT":
            localStorage.clear()
            return {...state, authenticated: false, user: {}, openstreams: []}


        default: {
            return state
        }
    }
}