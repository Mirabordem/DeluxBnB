import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import "./Reviews.css";
import CreateReviewModal from "./CreateReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";

const Reviews = ({ spot }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.reviews);

  const [reviewBtn, setReviewBtn] = useState(true);

  useEffect(() => {
    if (sessionUser) {
      if (spot.OwnerId === sessionUser.id) {
        setReviewBtn(false);
      } else if (
        reviews.filter((review) => review.userId === sessionUser.id).length > 0
      ) {
        setReviewBtn(false);
      }
    } else {
      setReviewBtn(false);
    }
  }, [spot.OwnerId, sessionUser, reviews]);

  useEffect(() => {
    if (spot.id) {
      dispatch(fetchSpotReviews(spot.id));
    }
  }, [dispatch, spot.id]);

  return (
    <div>
      <div className="reviews-container">
        <i
          className={`${
            spot.numReviews > 0
              ? "fa-solid fa-star fa-reviewstar"
              : "fa-regular fa-star fa-reviewstar"
          }`}
        ></i>
        {spot.avgStarRating ? (
          <p className="number-stars">&nbsp;{spot.avgStarRating}</p>
        ) : null}
        {spot.numReviews > 0 && <p className="reviews-dot">·</p>}
        <p className={spot.numReviews > 0 ? "review-text" : "text-new"}>
          {`${spot.numReviews} ${spot.numReviews === 1 ? "Review" : "Reviews"}`}
        </p>
      </div>

      {sessionUser ? (
        <div>
          {reviews.length === 0 && sessionUser.id !== spot.Owner.id ? (
            <p className="first-reviewer">Be the first to post a review!</p>
          ) : null}

          {reviewBtn && sessionUser.id !== spot.Owner.id && (
            <button className="post-review">
              <OpenModalMenuItem
                itemText="Post a Review"
                modalComponent={
                  <CreateReviewModal spot={spot} sessionUser={sessionUser} />
                }
              />
            </button>
          )}

          <div className="reviews-container">
            {/* Render spot details for logged-in users */}
          </div>

          {reviews
            .slice()
            .reverse()
            .map((review) => (
              <div className="single-review-container" key={review.id}>
                {/* Render reviews */}
              </div>
            ))}
        </div>
      ) : (
        <div>
          <div className="reviews-container">
            {/* Render spot details for logged-out users */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
