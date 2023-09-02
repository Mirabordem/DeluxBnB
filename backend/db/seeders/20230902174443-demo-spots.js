'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */

const allSpots = [
  {
    ownerId: 2,
    address: '456 Ocean Drive',
    city: 'Miami Beach',
    state: 'Florida',
    country: 'United States',
    lat: 25.789,
    lng: -80.131,
    name: 'Luxurious Beachfront Villa',
    description: 'Stunning beachfront villa with private pool and direct access to the beach. Spacious living areas, outdoor lounge, and gourmet kitchen.',
    price: 800.00
  },
  {
    ownerId: 1,
    address: '789 Forest Trail',
    city: 'Aspen',
    state: 'Colorado',
    country: 'United States',
    lat: 39.183,
    lng: -106.821,
    name: 'Mountain Retreat Cabin',
    description: 'Rustic cabin nestled in the woods. Ideal for nature lovers and hikers. Wood-burning fireplace and outdoor hot tub.',
    price: 150.00
  },
  {
    ownerId: 3,
    address: '1010 Broadway Avenue',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    lat: 40.742,
    lng: -73.989,
    name: 'Downtown Loft Oasis',
    description: 'Contemporary loft in the heart of Manhattan. Open floor plan, rooftop terrace, and skyline views. Perfect for urban explorers.',
    price: 500.00
  }
];



module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(allSpots, {validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
        name: { [Op.in]: ['Secluded Cabin', 'Beachfront Paradise', 'City View Loft']
      }
    })
  }
};
