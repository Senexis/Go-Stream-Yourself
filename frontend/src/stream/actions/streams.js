import axios from "../../axios"

export function getStreams(){
    return {
        type: "FETCH_STREAMS",
        payload: axios.get("/streams")
    }
}

export function searchStreams(key) {
    return {
        type: "SEARCH_STREAMS",
        payload: key
    }
}

export function loadViewers(data) {
    return {
        type: "STREAMS_UPDATE_VIEWERS",
        payload: data
    }
}

export function loadViewersOnLeave(stream) {
    return {
        type: "STREAMS_UPDATE_VIEWERS_ON_LEAVE",
        payload: stream
    }
}