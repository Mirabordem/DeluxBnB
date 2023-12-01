// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal"
// import { useHistory } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { createBookingThunk, getUserBookingsThunk } from "../../store/bookings";
// import "./Bookings.css"

// export default function NewBooking({ spot }) {
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const [startDate, setStartDate] = useState(new Date());
//     // Calculate minimum date for the end date picker
//     const minEndDate = startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : null;
//     const [endDate, setEndDate] = useState(minEndDate);
//     const [errors, setErrors] = useState({});
//     const [submitted, setSubmitted] = useState(false)
//     const { closeModal } = useModal();

//     useEffect(() => {
//         let errors = {};
//         if (!startDate) errors.start = "Start date is required"
//         if (!endDate) errors.end = "End date is required"
//         setErrors(errors);
//     }, [startDate, endDate])


//     useEffect(() => {
//         setEndDate(minEndDate)
//     }, [startDate])


//     function handleSubmit(e) {
//         setSubmitted(true)
//         e.preventDefault();

//         if (Object.values(errors).length) return;
//         // console.log("do we have an id?", spot.id)
//         // console.log("type of id ", typeof (spot.id))

//         dispatch(createBookingThunk(spot.id, { startDate, endDate }))
//             .then(dispatch(getUserBookingsThunk()))
//             .then(closeModal)
//             .then(() => history.push('/bookings'))
//             .catch(async (res) => {
//                 let error = await res.json()
//                 error = error.errors;

//                 let newErrors = {};
//                 if (error && error.message === "Authentication required") {
//                     newErrors.message = "Please log-in to request a booking"
//                 }
//                 if (error && error.endDate) {
//                     newErrors.end = error.endDate;
//                 }
//                 if (error && error.startDate) {
//                     newErrors.start = error.startDate;
//                 }
//                 if (!error) {
//                     newErrors.message = "You cannot book your own place."
//                 }
//                 setErrors(newErrors);
//                 return
//             })
//     }

//     return (
//         <form className="create-review" onSubmit={handleSubmit}>
//             <h2>Book your reservation:</h2>
//             {submitted && errors.message && (<p className="errors">{errors.message}</p>)}
//             <label className="review-label inside">
//                 <div className="errors-inside">
//                     Start Date
//                     {submitted && errors.start && (<p className="errors">{errors.start}</p>)}
//                 </div>
//                 <DatePicker
//                     selected={startDate}
//                     className="date-input"
//                     onChange={(date) => setStartDate(date)}
//                 />
//                 <i className="fa-regular fa-calendar"></i>
//             </label>
//             <label className="review-label inside">
//                 <div className="errors-inside">
//                     End Date
//                     {submitted && errors.end && (<p className="errors">{errors.end}</p>)}

//                 </div>
//                 <DatePicker
//                     selected={endDate}
//                     className="date-input"
//                     onChange={(date) => setEndDate(date)}
//                     minDate={minEndDate}
//                 />
//                 <i className="fa-regular fa-calendar"></i>
//             </label>
//             <button type="submit" className="my-button">Reserve Spot</button>
//         </form>
//     )
// }



import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createBookingThunk, getUserBookingsThunk } from "../../store/bookings";
import "./Bookings.css";

export default function NewBooking({ spot }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
    // Calculate minimum date for the end date picker
    const minEndDate = startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : null;
    const [endDate, setEndDate] = useState(minEndDate);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const { closeModal } = useModal();

    useEffect(() => {
        let errors = {};
        if (!startDate) errors.start = "Start date is required";
        if (!endDate) errors.end = "End date is required";
        setErrors(errors);
    }, [startDate, endDate]);

    useEffect(() => {
        setEndDate(minEndDate);
    }, [startDate]);

    function handleSubmit(e) {
        setSubmitted(true);
        e.preventDefault();

        if (Object.values(errors).length) return;

        dispatch(createBookingThunk(spot.id, { startDate, endDate }))
        .then(dispatch(getUserBookingsThunk()))
        .then(closeModal)
        .then(() => history.push("/bookings"))
        .catch(async (res) => {
            let error = await res.json();
            error = error.errors;

        let newErrors = {};
        if (error && error.message === "Authentication required") {
            newErrors.message = "Please log-in to request a booking";
        }
        if (error && error.endDate) {
            newErrors.end = error.endDate;
        }
        if (error && error.startDate) {
            newErrors.start = error.startDate;
        }
        if (!error) {
            newErrors.message = "You cannot book your own place.";
        }
        setErrors(newErrors);
        });
    }

return (
    <form className="create-review" onSubmit={handleSubmit}>
        <h2>Book your reservation:</h2>
        {submitted && errors.message && <p className="error">{errors.message}</p>}
        <label className="review-label inside">
        <div className="errors-inside">
            Start Date
            {submitted && errors.start && <p className="error">{errors.start}</p>}
        </div>
        <DatePicker
            selected={startDate}
            className="date-input"
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
        />
        <i className="fa-regular fa-calendar"></i>
        </label>
        <label className="review-label inside">
        <div className="errors-inside">
            End Date
            {submitted && errors.end && <p className="error">{errors.end}</p>}
        </div>
        <DatePicker
            selected={endDate}
            className="date-input"
            onChange={(date) => setEndDate(date)}
            minDate={minEndDate}
        />
        <i className="fa-regular fa-calendar"></i>
        </label>
        <button type="submit" className="my-button">
        Reserve Spot
        </button>
    </form>
    );
}
