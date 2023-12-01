import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteBookingThunk } from "../../store/bookings";
import "./Bookings.css";

export default function DeleteBooking({ bookingId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal()

    const handleDelete = (e) => {
        e.preventDefault();

        dispatch(deleteBookingThunk(bookingId))
            .then(closeModal)
    }

    return (
        <div className="delete-form">
            <h1>Confirm Delete</h1>
            <div className="are-you-sure">Are you sure you want to delete this booking?</div>
            <button id='cancel-button'  onClick={handleDelete}>Delete</button>
            <button id='delete-button'  onClick={(closeModal)}>Keep</button>
        </div>
    )
}
