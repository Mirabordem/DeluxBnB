import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../store/reviews";
import "./CreateReviewModal.css";



const CreateReviewModal = ({ spot, sessionUser }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (review.length < 3) {
      newErrors.review = "Review must be at least 3 characters long";
    }

    if (stars < 1) {
      newErrors.stars = "Please select a star rating";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const reviewPayload = {
        review,
        stars,
      };



      dispatch(thunkCreateReview(spot.id, reviewPayload, stars, sessionUser))
        .then(() => dispatch(fetchSpotReviews(spot.id)))
        .then(() => closeModal());
    }
  };



  return (
    <form onSubmit={handleSubmit} className="create-review">
      <h2 className="h2">How was your stay?</h2>
      {errors.review && <p className="error">{errors.review}</p>}
      <label>
        <textarea
          className="review-text-area"
          placeholder="Your review goes here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </label>
      {errors.stars && <p className="error">{errors.stars}</p>}
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <div
            key={starValue}
            className={`star ${stars >= starValue ? "filled" : ""}`}
            onClick={() => setStars(starValue)}
          >
            <i className={`fa-solid fa-star${stars >= starValue ? " filled" : ""}`}></i>
          </div>
        ))}
        <p className="stars-name">Stars</p>
      </div>
      <button
        className="my-button"
        type="submit"
      >
        Submit your review
      </button>
    </form>
  );
};

export default CreateReviewModal;
