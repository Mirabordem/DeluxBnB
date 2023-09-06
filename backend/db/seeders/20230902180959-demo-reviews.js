'use strict';

const { Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allReviews = [
  {
    spotId: 3,
    userId: 1,
    review: 'This cabin was absolutely amazing! The perfect place for a quiet and relaxing getaway in the woods.',
    stars: 5
  },
  {
    spotId: 3,
    userId: 3,
    review: 'The beachfront villa exceeded our expectations. The view and amenities were incredible. Highly recommended!',
    stars: 5
  },
  {
    spotId: 1,
    userId: 2,
    review: 'Had a great time at this urban loft. The location was perfect, and the loft had a stylish and comfortable vibe.',
    stars: 4
  },
  {
    spotId: 2,
    userId: 2,
    review: 'This mountain retreat was a slice of paradise. The peaceful surroundings and cozy cabin made for a memorable stay.',
    stars: 5
  },
  {
    spotId: 2,
    userId: 3,
    review: 'Our lakeside getaway was incredible. The spot was clean, well-equipped, and the lake view was breathtaking.',
    stars: 4
  },
  {
    spotId: 1,
    userId: 3,
    review: 'Enjoyed our stay at the city view loft. The location was convenient, and the loft offered stunning cityscape views.',
    stars: 4
  },
  {
    spotId: 2,
    userId: 4,
    review: 'We had a great time at this spot. The location is perfect for hiking and the cabin is cozy.',
    stars: 5
  },
  {
    spotId: 3,
    userId: 5,
    review: 'The view from this spot is stunning. We enjoyed our stay and would recommend it to others.',
    stars: 4
  },
  {
    spotId: 4,
    userId: 6,
    review: 'This spot exceeded our expectations. It was clean, quiet, and had all the amenities we needed.',
    stars: 5
  },
  {
    spotId: 5,
    userId: 7,
    review: 'Great spot for a family getaway. The kids loved the outdoor activities.',
    stars: 4
  },
  {
    spotId: 6,
    userId: 8,
    review: 'A perfect spot for relaxation. The hot tub was a bonus!',
    stars: 5
  },
  {
    spotId: 7,
    userId: 8,
    review: 'Nice spot with beautiful surroundings. We enjoyed our stay and would come back.',
    stars: 4
  },
  {
    spotId: 8,
    userId: 5,
    review: 'Had a great time at this spot. It was exactly what we were looking for.',
    stars: 5
  },
  {
    spotId: 9,
    userId: 5,
    review: 'The spot was clean and cozy. The hosts were friendly and accommodating.',
    stars: 4
  },
  {
    spotId: 10,
    userId: 8,
    review: 'We had an enjoyable stay at this spot. The amenities were top-notch.',
    stars: 5
  },
  {
    spotId: 8,
    userId: 3,
    review: 'The spot was perfect for a romantic getaway. We loved the fireplace.',
    stars: 4
  },
  {
    spotId: 7,
    userId: 2,
    review: 'A peaceful spot with great outdoor activities. We had a wonderful time.',
    stars: 5
  },
  {
    spotId: 5,
    userId: 3,
    review: 'The spot was well-maintained and had everything we needed for a comfortable stay.',
    stars: 4
  },
  {
    spotId: 4,
    userId: 6,
    review: 'Absolutely loved this spot. The sunset views were breathtaking.',
    stars: 5
  },
  {
    spotId: 3,
    userId: 6,
    review: 'This spot is a hidden gem. We had a peaceful and relaxing weekend.',
    stars: 4
  },
  {
    spotId: 1,
    userId: 5,
    review: 'The spot had a rustic charm and was perfect for a nature retreat.',
    stars: 5
  },
  {
    spotId: 7,
    userId: 3,
    review: 'Great spot for outdoor enthusiasts. We enjoyed hiking in the area.',
    stars: 4
  },
  {
    spotId: 8,
    userId: 8,
    review: 'Our stay at this spot was fantastic. We had a wonderful time by the lake.',
    stars: 5
  },
  {
    spotId: 9,
    userId: 7,
    review: 'The spot was clean, comfortable, and had a cozy fireplace.',
    stars: 4
  },
  {
    spotId: 2,
    userId: 3,
    review: 'We had a memorable weekend at this spot. The hosts were friendly and helpful.',
    stars: 5
  },
  {
    spotId: 2,
    userId: 5,
    review: "This spot offered stunning views and a relaxing atmosphere. We'll be back!",
    stars: 4
  },
  {
    spotId: 2,
    userId: 5,
    review: 'The spot was exactly as described. We had a peaceful and enjoyable stay.',
    stars: 5
  },
  {
    spotId: 3,
    userId: 8,
    review: 'A great spot for a weekend getaway. The surroundings were beautiful.',
    stars: 4
  },
  {
    spotId: 4,
    userId: 6,
    review: 'We had a wonderful time at this spot. The spot was well-equipped and cozy.',
    stars: 5
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
      await Review.bulkCreate(allReviews, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options)
  }
};
