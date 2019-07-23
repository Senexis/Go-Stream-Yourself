export default function reducer(state = {
    people: [],
    fetching: false,
    fetched: false,
    error: null,
}, action){
    switch(action.type){
        case "FETCH_PEOPLE_PENDING": {
            return {...state, fetching: true}
        }
        case "FETCH_PEOPLE_REJECTED": {
            return {...state, fetching: false, error: action.payload}
        }
        case "FETCH_PEOPLE_FULFILLED": {
            return {...state, fetching: false, fetched: true, people: action.payload.data}
        }
        default: {
            return state
        }
    }
}