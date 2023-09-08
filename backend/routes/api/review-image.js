const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();


//___________________________________________________________________

// DELETE A REVIEW IMAGE:


router.delete('/:imageId', requireAuth, async(req, res) => {
    const {user} = req;

    const image = await ReviewImage.findByPk(req.params.imageId);

    if(!image) {
      res.status(404);
      return res.json({message: "Review Image couldn't be found" })
    };

    const review = await image.getReview();
    if(user.id !== review.userId) {
      res.status(403);
      return res.json({message: "Forbidden: this spot doesn't belong to user"})
    };

    if(user.id === review.userId) {
      await image.destroy();

      res.status(200);
      return res.json({message: "Successfully deleted"})
    }
  });



//___________________________________________________________________








module.exports = router;
