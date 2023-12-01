import { csrfFetch } from "./csrf";

// ACTION TYPES:

export const GET_SPOTS = "spots/getSpots";
export const GET_DETAILS = "spots/getSpotDetails";
export const DELETE_SPOT = "spots/deleteSpot";
export const CLEAR_SPOT = "spots/clearSpot";

const UPDATE_SPOT_STATS = 'spots/updateStats';

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots,
  };
};

const getDetails = (spot) => {
  return {
    type: GET_DETAILS,
    spot,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

export const clearSpot = () => ({
  type: CLEAR_SPOT,
});


const updateSpotStats = (numReviews, avgRating) => ({
  type: UPDATE_SPOT_STATS,
  numReviews,
  avgRating,
});

//___________________________________________________

// THUNKS:

// landing page:
export const thunkGetSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    dispatch(getSpots(data));
    return data;
  }
};

// one spot page:
export const thunkGetDetails = (spotId) => async (dispatch) => {
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

// deleting spot:
export const thunkDeleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteSpot(spotId));
    return data;
  }
};

// creating spot:
export const thunkCreateNewSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

// updating spot:
export const thunkUpdateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

// creating image for spot:
export const thunkCreateImageForSpot =
  (newSpotId, url, preview) => async (dispatch) => {
    try {
    if (url === "") return null;
    const response = await csrfFetch(`/api/spots/${newSpotId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({url, preview}),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    const data = await error.json()
    console.log(data)
  }


  };

// current user's spots:
export const thunkGetUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(getSpots(data));
    return data;
  }
};

//___________________________________________________________

// SPOTS REDUCER:

const initialState = {
  allSpots: {},
  oneSpot: {
    numReviews: 0,
    avgRating: 0,
  },

};




const spotsReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case GET_SPOTS:
      newState = { ...state, allSpots: {} };
      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;

    case GET_DETAILS:
      newState = { ...state, oneSpot: {} };
      newState.oneSpot = action.spot;
      return newState;

    case DELETE_SPOT:
      newState = {
        ...state,
        allSpots: { ...state.allSpots },
        oneSpot: { ...state.oneSpot },
      };
      delete newState.allSpots[action.spotId];
      delete newState.oneSpot[action.spotId];
      return newState;
    default:
      return state;

    case CLEAR_SPOT:
      return {
        ...state,
        oneSpot: {},
      };

      case UPDATE_SPOT_STATS:
        return {
          ...state,
          oneSpot: {
            ...state.oneSpot,
            numReviews: action.numReviews,
            avgRating: action.avgRating,
          },
        };
  }
};

export default spotsReducer;
