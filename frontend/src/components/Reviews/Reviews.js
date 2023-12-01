import React, { useEffect } from "react";
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
  const avgStarRating = useSelector((state) => state.spots.oneSpot.avgStarRating);
  const numReviews = useSelector((state) => state.spots.oneSpot.numReviews);


  useEffect(() => {
    if (spot.id) {
      dispatch(fetchSpotReviews(spot.id));
    }
  }, [dispatch, spot.id]);



  const hasUserPostedReview = reviews.some(
    (review) => review.userId === sessionUser?.id
  );


  return (
    <div>
      <div className="reviews-container">
        <i
          className={`${
            avgStarRating > 0
              ? "fa-solid fa-star fa-reviewstar"
              : "fa-regular fa-star fa-reviewstar"
          }`}
        ></i>
        {avgStarRating ? (
          <p className="number-stars">&nbsp;{avgStarRating}</p>
        ) : null}
        {numReviews > 0 && <p className="reviews-dot">·</p>}
        <p className={numReviews > 0 ? "review-text" : "text-new"}>
          {`${numReviews} ${
            numReviews === 1 ? "Review" : "Reviews"
          }`}
        </p>
      </div>

      <div>
        {reviews.length === 0 &&
        sessionUser &&
        sessionUser.id !== spot.Owner.id ? (
          <p className="first-reviewer">Be the first to post a review!</p>
        ) : null}

        {!hasUserPostedReview && sessionUser && sessionUser.id !== spot.Owner.id && (
          <button className="post-review">
            <OpenModalMenuItem
              itemText="Post a Review"
              modalComponent={<CreateReviewModal spot={spot} sessionUser={sessionUser} />}
            />
          </button>
        )}

        <div className="reviews-container"></div>

        {reviews
          .slice()
          .reverse()
          .map((review) => (
            <div className="single-review-container" key={review.id}>
              <div className="review-header">
                <img
                  className="profile-icon"
                  src={
                    "https://image.jimcdn.com/app/cms/image/transf/none/path/sd0536822daf447dd/image/i9a305a7efa48dc70/version/1695953827/image.png"
                  }
                  alt=""
                />
                <div className="name-date">
                  <h3>{review.User.firstName}</h3>
                  <p>
                    {new Date(review.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="single-description">{review.review}</div>

              {review.userId === sessionUser?.id && (
                <button className="review-delete-button">
                  <OpenModalMenuItem
                    itemText="Delete"
                    modalComponent={<DeleteReviewModal spot={spot} review={review} />}
                    style={{ border: "1px solid black" }}
                  />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reviews;
