'use strict';
const crypto = require('crypto');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      username: 'batman91',
      email: 'demo@demo.com',
      password: crypto.createHash('sha1').update('password1').digest('hex'),
      provider: 'internal',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Joahna',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'demo@demo.com',
      password: crypto.createHash('sha1').update('password2').digest('hex'),
      provider: 'internal',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
