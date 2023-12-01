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
    <div className='delete-form'>
      <h1>Confirm Delete</h1>
      <div className="are-you-sure">Are you sure you want to delete this review?</div>

      <button id='cancel-button'  onClick={handleDelete}> Delete  </button>
      <button id='delete-button'  onClick={handleCancel}> Keep  </button>
    </div>
  )
}

export default DeleteReviewModal;
