import React from "react";
import { useDispatch } from "react-redux";
import { thunkDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteModal.css";
import _default from "react-redux/es/components/connect";

function DeleteModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkDeleteSpot(spot.id));
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="delete-modal">
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this spot?</h2>

      <button id="delete-button" className="button" onClick={handleDelete}>
        Yes (Delete Spot)
      </button>
      <button id="cancel-button" className="button" onClick={handleCancel}>
        No (Keep the Spot)
      </button>
    </div>
  );
}

export default DeleteModal;
