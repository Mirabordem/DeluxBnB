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
  },
  {
    ownerId: 2,
    address: '1234 Oak Street',
    city: 'Boulder',
    state: 'Colorado',
    country: 'United States',
    lat: 40.015,
    lng: -105.270,
    name: 'Cozy Urban Loft',
    description: 'Modern loft apartment in the heart of downtown. Close to restaurants, shops, and nightlife.',
    price: 200.00
  },
  {
    ownerId: 5,
    address: '456 Pine Avenue',
    city: 'Portland',
    state: 'Oregon',
    country: 'United States',
    lat: 45.512,
    lng: -122.684,
    name: 'Vintage Cottage by the River',
    description: 'Charming riverside cottage with a private garden. Perfect for a romantic getaway.',
    price: 175.00
  },
  {
    ownerId: 5,
    address: '789 Maple Lane',
    city: 'Seattle',
    state: 'Washington',
    country: 'United States',
    lat: 47.609,
    lng: -122.336,
    name: 'Luxury Downtown Penthouse',
    description: 'Elegant penthouse with stunning city views. Rooftop pool and fitness center.',
    price: 300.00
  },
  {
    ownerId: 5,
    address: '101 Redwood Drive',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    lat: 37.774,
    lng: -122.419,
    name: 'Designer Studio Apartment',
    description: 'Sleek and modern studio with designer furnishings. Walking distance to attractions.',
    price: 175.00
  },
  {
    ownerId: 8,
    address: '222 Pine Street',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    lat: 40.712,
    lng: -74.006,
    name: 'Historic Brownstone Townhouse',
    description: 'Spacious townhouse in a historic neighborhood. Close to museums and theaters.',
    price: 250.00
  },
  {
    ownerId: 4,
    address: '333 Elm Avenue',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    lat: 34.052,
    lng: -118.243,
    name: 'Beachfront Villa',
    description: 'Luxurious villa with private beach access. Ideal for a relaxing seaside getaway.',
    price: 400.00
  },
  {
    ownerId: 7,
    address: '444 Cedar Street',
    city: 'Austin',
    state: 'Texas',
    country: 'United States',
    lat: 30.267,
    lng: -97.743,
    name: 'Texas Ranch Retreat',
    description: 'Rustic ranch house with wide-open spaces. Perfect for outdoor enthusiasts.',
    price: 180.00
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
