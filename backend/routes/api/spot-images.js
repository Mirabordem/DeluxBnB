const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const router = express.Router();


//___________________________________________________________________

// DELETE A SPOT IMAGE:


router.delete('/:imageId', requireAuth, async(req, res) => {
  const { user } = req;
  
  const image = await SpotImage.findByPk(req.params.imageId);

  if(!image) {
    res.status(404);
    return res.json({message: "Spot Image couldn't be found" })
  };

  const spot = await image.getSpot();
  if(user.id !== spot.ownerId) {
    res.status(403);
    return res.json({message: "Forbidden: this spot doesn't belong to user"})
  };

  if(user.id === spot.ownerId) {
    await image.destroy();

    res.status(200);
    return res.json({message: "Successfully deleted"})
  }
});


//___________________________________________________________________












module.exports = router;
