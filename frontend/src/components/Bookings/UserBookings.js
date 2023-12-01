import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getUserBookingsThunk } from "../../store/bookings";
import FutureBookings from "./FutureBookings";
import { useHistory } from "react-router-dom";
import PastBookings from "./PastBookings";
import "./Bookings.css";




export default function UserBookings() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [loading, setLoading] = useState(true);
    const userBookings = Object.values(useSelector(state => state.bookings.user))
    console.log("user Bookings here: ", userBookings)

    useEffect(() => {
        dispatch(getUserBookingsThunk()).then(() => {
            setLoading(false)
        })
    }, [dispatch])

    let currentDate = new Date(new Date().setHours(0, 0, 0, 0))
    let futureBookings = userBookings
        .filter(booking => {
            let date = new Date(booking.startDate)
            return date >= currentDate
        })
        .sort((a, b) => {
            let aStart = new Date(a.startDate)
            let bStart = new Date(b.startDate)
            return aStart - bStart
        })

    console.log("future bookings", futureBookings)

    let pastBookings = userBookings
        .filter(booking => {
            let endDate = new Date(booking.endDate);
            return endDate < currentDate;
        })
        .sort((a, b) => {
            let aStart = new Date(a.startDate);
            let bStart = new Date(b.startDate);
            return bStart - aStart;
        });



    if (loading) return <div><h1>...Loading</h1></div>

    return (
        <div className="trips-wrapper">
            <h2>Your Bookings</h2>
            <div className="divider1"></div>
                <h1> Upcoming Trips</h1>

                {futureBookings.length < 1 && (
                    <div className="no-trip-container">
                        <div className="no-trips-yet">No trips to be excited for now!</div>
                        <p className="plan">Time to start planning...</p>
                        <button id="booking-start-searching"
                            onClick={() => {
                                history.push('/')
                            }}
                        >Start searching</button>
                    </div>)}
                    <div className="upcoming-trip-div">
                {futureBookings.map(booking => {
                    return (<div key={booking.id} className="booking-tile">
                        <FutureBookings booking={booking} future={true} />
                    </div>)
                })}
            </div>
            <div className="divider"></div>
                {userBookings.length > 0 && pastBookings.length > 0 && (<h1 >Finished Trips</h1>)}
                <div className="past-trip-div">
                <div className="bookings-container">
                    {pastBookings.map(booking => {
                        return (<div key={booking.id} className="booking-tile">
                            <PastBookings booking={booking} />
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
}
