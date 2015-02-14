'use strict';

let AppDispatcher = require('../dispatchers/AppDispatcher');
let request       = require('../utils/hn-api-request');
let Rx            = require('rx');

module.exports = {
  /**
   * @param {String} id
   */
  fetchUser: function(id) {
    request(`user/${id}.json`).subscribe(function(user) {
      AppDispatcher.handleAction('user:upsert', {user : user});
    });
  }
};
