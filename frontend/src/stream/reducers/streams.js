export default function reducer(state = {
    streams: [],
    fetching: false,
    fetched: false,
    error: null,
    searchword: ""
}, action){
    switch(action.type){

        // Retrieving streams
        case "FETCH_STREAMS_PENDING": {
            return {...state, fetching: true}
        }
        case "FETCH_STREAMS_REJECTED": {
            
            return {...state, fetching: false, error: action.payload}
        }
        case "FETCH_STREAMS_FULFILLED": {
            return {...state, fetching: false, fetched: true, streams: action.payload.data.map((stream) => {return {...stream, messages: [], chattimestamp: 0}})}
        }

        // Searching streams
        case "SEARCH_STREAMS": {
            return {...state, searchword: action.payload}
        }

        // Searching streams
        case "STREAMS_UPDATE_VIEWERS": {
            return {...state, streams: state.streams.map((stream) => {
                return {
                    ...stream,
                    Viewers: action.payload[stream._id] || 0
                }
            })}
        }

        case "STREAMS_UPDATE_VIEWERS_ON_LEAVE": {
            return {...state, streams: state.streams.map((stream) => {
                if(stream._id === action.payload) {
                    return {
                        ...stream,
                        Viewers: --stream.Viewers<0?0:stream.Viewers
                    }
                } else {
                    return stream
                }
            })}
        }

        // Default
        default: {
            return state
        }
    }
}