import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../store/reviews";
import "./CreateReviewModal.css";

const CreateReviewModal = ({ spot }) => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  useEffect(() => {
    if (review.length < 10 || stars < 1) {
      setErrors({
        // review: review.length < 10 ? "Review must be at least 10 characters long" : "",
        // stars: stars < 1 ? "Please select a star rating" : "",
      });
    } else {
      setErrors({});
    }
  }, [review, stars]);

  const handleStarClick = (starValue) => {
    setStars(starValue); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).length === 0) {
      const reviewPayload = {
        review,
        stars,
      };

      dispatch(thunkCreateReview(reviewPayload, spot.id))
        .then(() => dispatch(fetchSpotReviews(spot.id)))
        .then(() => closeModal());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-review">
      <h2 className="h2">How was your stay?</h2>
      {errors.review && <p>{errors.review}</p>}
      {errors.stars && <p>{errors.stars}</p>}
      <label>
        <textarea
          className="review-text-area"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </label>
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <div
            key={starValue}
            className={`star ${stars >= starValue ? "filled" : ""}`}
            onClick={() => handleStarClick(starValue)}
          >
            <i className={`fa-solid fa-star${stars >= starValue ? " filled" : ""}`}></i>
          </div>
        ))}
        <p className="stars-name">Stars</p>
      </div>
      <button
        className="my-button"
        type="submit"
        disabled={review.length < 10 || stars < 1}
      >
        Submit your review
      </button>
    </form>
  );
};

export default CreateReviewModal;
