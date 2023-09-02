'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Frank',
        lastName: 'Wright',
        email: 'frankwright34@gmail.com',
        username: 'fruuunk',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Tom',
        lastName: 'Long',
        email: 'tomlonggg54@gmail.com',
        username: 'Longgggtomy',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Anna',
        lastName: 'Doe',
        email: 'aniadoei@gmail.com',
        username: 'annAdoE65',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demolition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
