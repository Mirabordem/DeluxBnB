import { csrfFetch } from "./csrf";
export const LOAD_BOOKINGS = "bookings/LOAD_BOOKINGS"
export const CREATE_BOOKING = "bookings/CREATE_BOOKING"
export const EDIT_BOOKING = "bookings/EDIT_BOOKING"
export const DELETE_BOOKING = "bookings_DELETE_BOOKING"
export const USER_BOOKINGS = "bookings/USER_BOOKINGS"


export const loadBookings = (spotId, data) => {
    return {
        type: LOAD_BOOKINGS,
        data,
        spotId
    }
}

export const createBooking = (spotId, data) => {
    return ({
        type: CREATE_BOOKING,
        data,
        spotId
    })
}


export const deleteBooking = (spotId) => {
    return {
        type: DELETE_BOOKING,
        spotId
    }
}

export const userBookings = (data) => {
    return {
        type: USER_BOOKINGS,
        data
    }
}


//________________________________________


// THUNKS



export const getBookingsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)
    const data = await response.json()
    dispatch(loadBookings(data, spotId))
    return data;
}


export const createBookingThunk = (spotId, data) => async dispatch => {
    // console.log("in thunk ", spotId, data)
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(createBooking(data, spotId))
        return data;
    }
    else {
        const error = await response.json()
        return error;
    }
}

export const getUserBookingsThunk = () => async dispatch => {
    const response = await csrfFetch('/api/bookings/current')
    const data = await response.json();
    dispatch(userBookings(data))
    return data;
}

export const editBookingThunk = (spotId, data) => async dispatch => {

}

export const deleteBookingThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${spotId}`, {
        method: "DELETE",
    })
    const data = await response.json();
    dispatch(deleteBooking(spotId))
}


//________________________________________


const initialState = { user: {}, spot: {} }

//________________________________________

// reducer:


export default function bookingsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case LOAD_BOOKINGS:
            newState = { ...state }
            newState.spot = { ...newState.spot }
            newState.user = { ...newState.user }
            action.data.Bookings.forEach(booking => {
                newState.spot[action.id] = booking;
            })
            return newState;
        case USER_BOOKINGS:
            newState = { ...state }
            newState.spot = { ...newState.spot }
            newState.user = {};
            action.data.Bookings.forEach(booking => {
                newState.user[booking.id] = booking;
            })
            return newState;
        case CREATE_BOOKING:
            newState = { ...state }
            newState.spot = { ...newState.spot }
            newState.user = { ...newState.user }
            newState.spot[action.data.id] = action.data
            newState.user[action.data.id] = action.data
            return newState;

        case DELETE_BOOKING:
            newState = { ...state }
            newState.spot = { ...newState.spot }
            newState.user = { ...newState.user }
            delete newState.user[action.id]
            delete newState.spot[action.id]
            return newState;

        default:
            return state;
    }
}
