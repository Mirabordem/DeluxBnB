'use strict';

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allReviewImages = [
  {
    reviewId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/f7106e86-21ae-4b12-b484-045c7ffe36aa.jpeg?im_w=1440"
  },
  {
    reviewId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/f521ff28-1525-48c9-8e95-34216c6ae021.jpeg?im_w=1440"
  },
  {
    reviewId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/8fff33f0-f7f5-40b1-a3c4-2bf66c9493e0.png?im_w=1440"
  },
  {
    reviewId: 4,
    url: "https://a0.muscache.com/im/pictures/9138b90b-cc3f-49ce-98d7-4a8b61bb0b49.jpg?im_w=1200"
  },
  {
    reviewId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-781965716277679549/original/6e110e3b-a111-428b-98f0-8d5d48a90bbb.jpeg?im_w=1200"
  },
  {
    reviewId: 6,
    url: "https://a0.muscache.com/im/pictures/1b43257e-626b-4e02-8d60-ade2adb3692a.jpg?im_w=1200"
  },
  {
    reviewId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-51390402/original/e60ffdca-20da-460d-ab21-e6f08dbcada9.jpeg?im_w=1200"
  },
  {
    reviewId: 8,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-51390402/original/fc125ef4-d4ae-4c4a-b35d-92d7463c734b.jpeg?im_w=720"
  },
  {
    reviewId: 9,
    url: "https://a0.muscache.com/im/pictures/181d4be2-6cb2-4306-94bf-89aa45c5de66.jpg?im_w=1200"
  },
  {
    reviewId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-852139182164211478/original/e2ddd200-7079-4801-9c45-ef2bf96bec8b.jpeg?im_w=720"
  }
]



module.exports = {
  async up (queryInterface, Sequelize) {
      await ReviewImage.bulkCreate(allReviewImages, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options)
  }
};
