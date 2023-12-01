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
    <div className="delete-form">
      <h1>Confirm Delete</h1>
      <div className="are-you-sure">Are you sure you want to delete this place?</div>

      <button id='cancel-button'  onClick={handleDelete}>
        Delete
      </button>
      <button id='delete-button'  onClick={handleCancel}>
       Keep
      </button>
    </div>
  );
}

export default DeleteModal;
