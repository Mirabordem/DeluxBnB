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
        {spot.numReviews < 1 && reviewBtn && (
          <button className="post-review">
            <OpenModalMenuItem
              itemText="Post a Review"
              modalComponent={<CreateReviewModal spot={spot} />}
            />
          </button>
        )}
        {spot.numReviews < 1 && <p>Be the first to post a review!</p>}
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

        {spot.avgStarRating > 0 ? (
          <p className="stars-two">{parseInt(spot.avgRating).toFixed(2)}</p>
        ) : null}
        {spot.numReviews > 0 ? <p className="reviews-dot">·</p> : null}
        <p className={spot.numReviews > 0 ? "review-text" : "text-new"}>
          {checkReviews(spot.numReviews)}
        </p>
      </div>


      {reviews.length === 0 && sessionUser.id !== spot.Owner.id ? (
        <p className="first-reviewer">Be the first to post a review!</p>
      ) : null}

      {reviewBtn && (
        <button className="post-review">
          <OpenModalMenuItem
            itemText="Post a Review"
            modalComponent={<CreateReviewModal spot={spot} sessionUser={sessionUser}/>}
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



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSpotReviews } from "../../store/reviews";
// import { thunkGetDetails } from "../../store/spots";
// import "./Reviews.css";
// import CreateReviewModal from "./CreateReviewModal";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import DeleteReviewModal from "./DeleteReviewModal";

// const Reviews = ({ spot }) => {
//   const dispatch = useDispatch();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [reviewBtn, setReviewBtn] = useState(true);

//   useEffect(() => {
//     // Logic to determine if review button should be disabled
//     if (sessionUser) {
//       if (spot.OwnerId === sessionUser.id) {
//         setReviewBtn(false);
//       } else if (
//         spot.Reviews.some((review) => review.userId === sessionUser.id)
//       ) {
//         setReviewBtn(false);
//       }
//     } else {
//       setReviewBtn(false);
//     }
//   }, [spot, sessionUser]);

//   useEffect(() => {
//     dispatch(thunkGetDetails(spot.id));
//     dispatch(fetchSpotReviews(spot.id));
//   }, [dispatch, spot.id]);

//   return (
//     <div>
//       <div className="reviews-container">
//         <i
//           className={`${
//             spot.numReviews > 0
//               ? "fa-solid fa-star fa-reviewstar"
//               : "fa-regular fa-star fa-reviewstar"
//           }`}
//         ></i>
//         {spot.avgStarRating > 0 ? (
//           <p className="stars-two">{spot.avgStarRating.toFixed(2)}</p>
//         ) : null}
//         {spot.numReviews > 0 && <p className="reviews-dot">·</p>}
//         <p className={spot.numReviews > 0 ? "review-text" : "text-new"}>
//           {spot.numReviews === 0
//             ? "Be the first to post a review!"
//             : `${spot.numReviews} ${
//                 spot.numReviews === 1 ? "Review" : "Reviews"
//               }`}
//         </p>
//       </div>

//       {reviewBtn && (
//         <button className="post-review">
//           <OpenModalMenuItem
//             itemText="Post a Review"
//             modalComponent={<CreateReviewModal spot={spot} sessionUser={sessionUser} />}
//           />
//         </button>
//       )}

//       <div className="reviews-container"></div>

//       {spot.Reviews.map((review) => (
//         <div className="single-review-container" key={review.id}>
//           <div className="review-header">
//             <img
//               className="profile-icon"
//               src={
//                 "https://image.jimcdn.com/app/cms/image/transf/none/path/sd0536822daf447dd/image/i9a305a7efa48dc70/version/1695953827/image.png"
//               }
//               alt=""
//             />
//             <div className="name-date">
//               <h3>{review.User.firstName}</h3>
//               <p>{new Date(review.updatedAt).toLocaleDateString()}</p>
//             </div>
//           </div>
//           <div className="single-description">{review.review}</div>

//           {review.userId === sessionUser?.id && (
//             <button className="review-delete-button">
//               <OpenModalMenuItem
//                 itemText="Delete"
//                 modalComponent={<DeleteReviewModal spot={spot} review={review} />}
//               />
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Reviews;
