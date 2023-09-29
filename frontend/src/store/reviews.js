import { csrfFetch } from "./csrf";

const CREATE_REVIEW = "reviews/createReview";
const LOAD_REVIEWS = "reviews/loadReviews";
const DELETE_REVIEW = "reviews/deleteReview";

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


export const fetchSpotReviews = (spotId) => async(dispatch) =>{
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if(res.ok){
      const reviews = await res.json();
      dispatch(loadReview(reviews));
  }else{
      const errors = res.json()
      return errors
  }
}
//________________________________________

// THUNKS

export const thunkCreateReview =
  (spotId, reviewText, stars, sessionUser) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: reviewText.review, stars }),
    });

    if (response.ok) {
      let data = await response.json();
      data.User = sessionUser;
      dispatch(createReview(data));
      return data;
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

//_______________________________________

// reviews reducer:

const initialState = {
  reviews: [],
};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {

    case CREATE_REVIEW:
      newState = { ... state, reviews: [ ...state.reviews, action.review] };
      // newState.reviews.filter(review => {
      //   return review;
      // })
      // newState.reviews.push(action.review);
      return newState;

    case LOAD_REVIEWS:
      newState = { ...state, reviews: action.reviews.Reviews };
      return newState;

    case DELETE_REVIEW:
      newState = { ...state, reviews: state.reviews.filter((review) => review.id !== action.reviewId), };
      delete newState.reviews[action.reviewId];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
