import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { thunkGetDetails } from "../../store/spots";
import { thunkLoadReviews } from "../../store/reviews";
import "./Reviews.css";
import CreateReviewModal from "./CreateReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";

const Reviews = ({ spot, reviews, user }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
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
    } else if (!sessionUser) {
      setReviewBtn(false);
    } else {
      setReviewBtn(true);
    }
  }, [spot.ownerId, reviewBtn, sessionUser, reviews.length]);

  useEffect(() => {
    dispatch(thunkLoadReviews(spot.id));
    dispatch(thunkGetDetails(spot.id));
  }, [dispatch, spot.id, sessionUser]);

  if (!reviews.length) {
    return (
      <div className="first-review">
        {spot.numReviews < 1 &&
          reviewBtn &&
          sessionUser.id !== spot.ownerId && (
            <button className="post-review">
              <OpenModalMenuItem
                itemText="Post a Review"
                modalComponent={<CreateReviewModal spot={spot} />}
              />
            </button>
          )}
        {spot.numReviews < 1 && sessionUser.id !== spot.ownerId && (
          <p>Be the first to post a review!</p>
        )}
      </div>
    );
  }

  const checkReviews = (reviews) => {
    if (reviews === 0) return "New";
    else if (reviews === 1) return `${reviews} Review`;
    else return `${reviews} Reviews`;
  };

  const getEasierDate = (array) => {
    let sortedReviews = [];
    for (let i = 0; i < array.length; i++) {
      let review = array[i];
      const date = review.updatedAt;

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const betterDate = new Date(date);
      const fullMonth = monthNames[betterDate.getMonth()];
      const fullYear = betterDate.getFullYear();
      review.reviewDate = `${fullMonth} ${fullYear}`;

      sortedReviews.unshift(review);
    }
    return sortedReviews;
  };

  const sortedReviews = getEasierDate(reviews);

  return (
    <div>
      <div className="reviews-container">
        <i
          className={
            spot.numReviews > 0
              ? "fa-solid fa-star fa-reviewstar"
              : "fa-regular fa-star fa-reviewstar"
          }
        ></i>

        {spot.avgStarRating ? (
          <p className="number-stars">&nbsp;{spot.avgStarRating}</p>
        ) : null}
        {spot.numReviews > 0 ? <p className="reviews-dot">·</p> : null}
        <p className={spot.numReviews > 0 ? "review-text" : "text-new"}>
          {checkReviews(spot.numReviews)}
        </p>
      </div>

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

      <div className="reviews-container"></div>
      {sortedReviews.map((review) => (
        <div className="single-review-container">
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
              <p>{review.reviewDate}</p>
            </div>
          </div>
          <div className="single-description">{review.review}</div>

          {review.userId === sessionUser.id && (
            <button className="review-delete-button">
              {/* {review.userId === sessionUser.id && ( */}
              <OpenModalMenuItem
                itemText="Delete"
                modalComponent={
                  <DeleteReviewModal spot={spot} user={user} review={review} />
                }
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
