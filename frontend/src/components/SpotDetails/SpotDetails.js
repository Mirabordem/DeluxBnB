import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";
import Reviews from "../Reviews/Reviews";
import { thunkLoadReviews } from "../../store/reviews";



function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.oneSpot);
  const user = useSelector((state) => state.session.user);
  const objReviews = useSelector((state) => state.reviews.reviews);




  useEffect(() => {
    dispatch(thunkGetDetails(spotId));
    dispatch(thunkLoadReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  if (Object.keys(spot).length === 0 || !spot) return null;



  let otherImages = spot.SpotImages.filter((image) => !image.preview);



  if (otherImages.length < 4) {
    let index = otherImages.length;
    const emptyImage = {
      url: "https://image.jimcdn.com/app/cms/image/transf/none/path/sd0536822daf447dd/image/i3ef5a3008602d20d/version/1695685999/image.png",
    };
    while (index < 4) {
      otherImages[index] = emptyImage;
      index++;
    }
  }

  const reviewsStatus = (reviews) => {
    if (reviews === 0) {
      return "New";
    } else if (reviews === 1) {
      return `${reviews} Review`;
    } else {
      return `${reviews} Reviews`;
    }
  };

  const previewImage = spot.SpotImages.find((image) => image.preview);

  return (
    <div className="wrapper">
      <div className="details-container">
        <h1 className="h1">{spot.name}</h1>
        <h2 className="h2">
          {spot.city}, {spot.state}, {spot.country}
        </h2>
        <div className="image-bundle">
          <img
            className="preview-image"
            src={previewImage ? previewImage.url : ""}
            alt=""
          ></img>
          <div className="small-images-container">
            {otherImages.map((image, index) => (
              <img
                className="small-images"
                id={
                  (index === 1 && "topright") ||
                  (index === 3 && "bottomright") ||
                  ""
                }
                src={image.url}
                alt=""
                key={image.id}
              ></img>
            ))}
          </div>
        </div>
        <div className="host">
          Hosted by:
          <p className="host-name">
            &nbsp;{spot.Owner.firstName} {spot.Owner.lastName}
          </p>
        </div>
        <div className="info-container">
          <div className="description">
            <p>{spot.description}</p>
            <p className="show-more">Show more</p>
          </div>
          <div className="reserve-container">
            <div className="reserve-top">
              <p className="price">
                <strong>${spot.price}</strong> night
              </p>
              <div className="star-first">
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
                {spot.numReviews > 0 ? <p className="dot">・</p> : null}
                <p
                  className={
                    spot.numReviews > 0
                      ? "spotdetails-reviewtext"
                      : "spotdetails-newtext"
                  }
                >
                  {reviewsStatus(spot.numReviews)}
                </p>
              </div>
            </div>
            <button
              className="reserve-button"
              onClick={() => {
                alert("Feature coming soon!");
              }}
            >
              Reserve
            </button>
          </div>
        </div>
        <div>
          <Reviews spot={spot} user={user} reviews={objReviews} />
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
