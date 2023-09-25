import { csrfFetch } from "./csrf";


// ACTION TYPES:

export const GET_SPOTS = 'spots/getSpots';
export const GET_DETAILS = 'spots/getSpotDetails';
export const DELETE_SPOT = 'spots/deleteSpot';
// export const CLEAR_SPOT = 'spots/clearSpot';


const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

const getDetails = (spot) => {
    return {
        type: GET_DETAILS,
        spot
    }
};

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
};

// const clearSpot = () => {
//     return {
//         type: CLEAR_SPOT
//     }
// };

//___________________________________________________

// THUNKS:

export const thunkGetSpots = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const data = await response.json();
        dispatch(getSpots(data));
        return data;
    }
};


export const thunkGetDetails = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getDetails(data));
        return data;
    } else {
        const errors = await response.json();
        console.log(errors);
        return errors;
    }
};


export const thunkDeleteSpot = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteSpot(spotId));
        return data;
    }
};


export const thunkCreateNewSpot = (spot) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }
};


export const thunkUpdateSpot = (spotId, spot) => async(dispatch) => {
    // console.log(spot)
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }
};


export const thunkCreateImageForSpot = (newSpotId, url, preview) => async(dispatch) => {
    if (url === '') return null;
    const response = await csrfFetch(`/api/spots/${newSpotId}/images`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(url, preview)
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }
};


export const thunkGetUserSpots = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const data = await response.json();
        dispatch(getSpots(data));
        return data;
    }
};



//___________________________________________________________

// SPOTS REDUCER:
