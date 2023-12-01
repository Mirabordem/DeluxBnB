import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetSpots } from "../../store/spots";
import { getReviewsCurrentThunk, fetchSpotReviews } from "../../store/reviews";
import DeleteBooking from "./DeleteBooking";
import { useHistory } from "react-router-dom"
import OpenModalButton from "../OpenModalButton";
import "./Bookings.css";

export default function FutureBookings({ booking, future, spotId }) {
    const dispatch = useDispatch();
    const history = useHistory()
    let user = useSelector((state) => state.session?.user)
    let userSpotReview = Object.values(useSelector((state) => state.review?.userId || {}));

    useEffect(() => {
        dispatch(thunkGetSpots())
            .then(dispatch(getReviewsCurrentThunk()))
    }, [dispatch])

    useEffect(() => {
        if (spotId) {
          dispatch(fetchSpotReviews(spotId));
        }
      }, [dispatch, spotId]);

    let spot = booking.Spot;
    let allSpots = Object.values(useSelector((state) => state.spots.allSpots))
    let preview = allSpots.find(spot => spot.id === booking.spotId)
    if (preview) {
        preview = preview.previewImage;
    }


    let startDate = booking.startDate
    let endDate = booking.endDate

    if (user) {
        userSpotReview = userSpotReview.filter((review) => review.userId === user.id && review.spotId === booking.spotId)
    }
    let userReviewed = userSpotReview.length;

    if (!spot) return <div>...Loading</div>

    return (
        <div className="future-trip-card">
            <img src={preview}
                onClick={() => history.push(`/spots/${spot.id}`)}
            />

            <div className="text-container-booking-card">
                <h2 style={{ margin: '0', marginBottom: '-5px', marginTop: '10px'  }} className="booking-text" onClick={() => history.push(`/spots/${spot.id}`)}>
                    {spot.city}
                </h2>
                <h4 className="booking-text"
                    style={{ fontSize: '14px', margin: '0', marginTop: '-18px', color: 'gray' }}
                    onClick={() => history.push(`/spots/${spot.id}`)}>{spot.name}
                </h4>
                <div id="booking-dates-container">
                    {future && (
                        <div>
                            <div className="booking-dates">
                                <p className="start-date-card">Beginning:
                                    <span> </span>
                                    <strong>{new Date(startDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    </strong>
                                </p>
                            </div>
                            <div className="booking-dates">
                                <p className="end-date-card">Ending:
                                    <span> </span>
                                    <strong>{new Date(endDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    </strong>
                                </p>
                            </div>
                            <OpenModalButton
                                buttonText="Delete Booking"
                                modalComponent={<DeleteBooking bookingId={booking.id} />}
                                className="cancel-booking-button"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
