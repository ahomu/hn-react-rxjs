'use strict';

let AppDispatcher = require('../dispatchers/AppDispatcher');
let request       = require('../utils/hn-api-request');
let Rx            = require('rx/dist/rx.experimental.js');

module.exports = {

  /**
   *
   */
  initTopStories: function() {
    request('topstories.json').subscribe(function(ids) {
      Rx.Observable
        .forkJoin(ids.slice(0, 30).map((id) => request(`item/${id}.json`)))
        .subscribe(function(results) {
          AppDispatcher.handleAction('items:insert', {items : results});
        });
    });
  },

  /**
   * @param {String} id
   */
  fetchItem: function(id) {
    request(`item/${id}.json`).subscribe(function(item) {
      AppDispatcher.handleAction('item:upsert', {item : item});
    });
  },

  /**
   * @param {Array.<String>} ids
   */
  fetchItems: function(ids = []) {
    Rx.Observable
      .forkJoin(ids.map((id) => request(`item/${id}.json`)))
      .subscribe(function(results) {
        AppDispatcher.handleAction('items:upsert', {items : results});
      });
  }
};
