import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeleteReview } from '../../store/reviews';
import { thunkGetDetails } from '../../store/spots';

function DeleteReviewModal({ review, spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleCancel = () => {
    closeModal();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const deleted = await dispatch(thunkDeleteReview(review.id))
    if(deleted) {
      dispatch(thunkGetDetails(spot.id))
    }
    closeModal();
  };

  return (
    <div className='delete-modal'>
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to delete this review?</h2>

      <button id='cancel-button' className='modal-button' onClick={handleDelete}> Yes (Delete Review) </button>
      <button id='delete-button' className='modal-button' onClick={handleCancel}> No (Keep Review) </button>
    </div>
  )
}

export default DeleteReviewModal;
