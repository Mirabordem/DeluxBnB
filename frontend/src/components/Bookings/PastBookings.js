import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpots } from "../../store/spots";
import { useEffect } from "react";
import { getReviewsCurrentThunk } from "../../store/reviews";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import "./Bookings.css";


export default function PastBookings({ booking }) {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(thunkGetSpots())
            .then(dispatch(getReviewsCurrentThunk()));
    }, [dispatch]);

    let spot = booking.Spot;
    let allSpots = Object.values(useSelector((state) => state.spots.allSpots));
    let preview = allSpots.find((spot) => spot.id === booking.spotId);
    if (preview) {
        preview = preview.previewImage;
    }

    let startDate = booking.startDate;
    let endDate = booking.endDate;

    let user = useSelector((state) => state.session?.user);
    let userSpotReview = Object.values(useSelector((state) => state.review?.userId || {}));
    if (user) {
        userSpotReview = userSpotReview.filter(
        (review) => review.userId === user.id && review.spotId === booking.spotId
        );
    }
    let userReviewed = userSpotReview.length;

    if (!spot) return <div>...Loading</div>;

return (
    <div className="past-trip-card">
        <img
        src={preview}
        onClick={() => history.push(`/spots/${spot.id}`)}
        ></img>

        <div className="booking-text-container">
        <div className="booking-dates-container">
            <h3
            // style={{ fontSize: "14px", margin: "0" }}
            className="booking-text"
            onClick={() => history.push(`/spots/${spot.id}`)}
            >
            {spot.city}
            </h3>
            <div className="booking-dates">
            <p style={{ fontSize: "12px", margin: "0" }}>
                {new Date(startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                })}
                <span> - </span>
                {new Date(endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                })}
            </p>
            </div>
        </div>
        {!userReviewed && (
            <div>
            <OpenModalButton
                className="past-trips-button"
                buttonText="Post your Review"
                modalComponent={<CreateReviewModal spot={spot} user={user} />}
                style={{ fontSize: "10px", height: "0.5rem", borderRadius: "6px" }}
            />
            </div>
        )}
        </div>
    </div>
    );
}
