import { csrfFetch } from "./csrf";
import { thunkGetDetails } from './spots';

const CREATE_REVIEW = "reviews/createReview";
const LOAD_REVIEWS = "reviews/loadReviews";
const DELETE_REVIEW = "reviews/deleteReview";
const CURR_REVIEWS = '/reviews/spotId'



const createReview = (review) => ({
  type: CREATE_REVIEW,
  review,
});

const loadReview = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

export function getReviewsCurrent(data) {
  return {
      type: CURR_REVIEWS,
      data
  }
}




//________________________________________


// THUNKS

// export const fetchSpotReviews = (spotId) => async(dispatch) =>{
//   const res = await fetch(`/api/spots/${spotId}/reviews`);
//   if(res.ok){
//       const reviews = await res.json();
//       dispatch(loadReview(reviews));
//   }else{
//       const errors = res.json()
//       return errors
//   }
// }

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
      const reviews = await res.json();
      dispatch(loadReview(reviews));
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    console.error('Error fetching spot reviews:', error);

    return { error: 'Failed to fetch spot reviews' };
  }
};



export const thunkCreateReview = (spotId, reviewText, stars, sessionUser) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: reviewText.review, stars }),
    });

    if (response.ok) {
      let data = await response.json();
      data.User = sessionUser;

      dispatch(createReview(data));
      dispatch(thunkGetDetails(spotId));
      dispatch(thunkLoadReviews(spotId));

      return data;
    }
  } catch (error) {
    console.error("Error creating review:", error);
  }
};




export const thunkLoadReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadReview(data));

    return data;
  }
};



export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteReview(reviewId));
    return data;
  }
};


export const getReviewsCurrentThunk = () => async dispatch => {
  const response = await csrfFetch('/api/reviews/current')
  const data = await response.json();
  dispatch(getReviewsCurrent(data))
}

//_______________________________________


const initialState = {
  reviews: [],
  spot: {},
  userId: null
};

//_______________________________________

// reviews reducer:


const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {

      case CREATE_REVIEW:
      newState = {
        ...state,
        reviews: [...state.reviews, action.review],
        numReviews: action.numReviews,
        avgRating: action.avgRating,
      };
      return newState;


      case LOAD_REVIEWS:
      newState = {
        ...state,
        reviews: action.reviews.Reviews,
        numReviews: action.reviews.numReviews,
        avgRating: action.reviews.avgRating,
      };
      return newState;


      case DELETE_REVIEW:
        newState = {
          ...state,
          reviews: state.reviews.filter((review) => review.id !== action.reviewId),
        };
        return newState;


      case CURR_REVIEWS: {
        let newState = { ...state };
        newState.user = {};
        action.data.Reviews.forEach((review) => {
          newState.user[review.id] = review;
        });
        return newState;
      }

        default:
          return state;
};
}
export default reviewsReducer;
