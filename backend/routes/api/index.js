const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js')
const reviewImageRouter = require('./review-image.js')
const reviewsRouter = require('./reviews.js')
const spotImagesRouter = require('./spot-images.js');




const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);



router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
// router.use('/review-image', reviewImageRouter);
// router.use('/bookings', bookingsRouter);
// router.use('/reviews', reviewsRouter);
// router.use('/spot-images', spotImagesRouter);


router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});




module.exports = router;





// GET /api/restore-user
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );






// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });





// // GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );
