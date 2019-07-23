import axios from "../../axios"

export function getChat(stream){
    return {
        type: "FETCH_STREAMCHAT",
        payload: axios.get("/chat/"+stream._id, {
            headers: {
                timestamp: stream.chattimestamp
            },
            forceUpdate: true
        }),
        meta: {
            stream: stream
        }
    }
}

export function sendChatMessage(message, user, stream){
    return {
        type: "SEND_STREAMCHAT",
        payload: axios.post("/chat/"+stream._id, {
            content: message,
            Content: message
        }),
        meta: {
            user: user,
            message: message,
            stream: stream,
        }
    }
}

export function loadMessage(message){
    return {
        type: "CONCAT_STREAMCHAT",
        meta: {
            message: message
        }
    }
}