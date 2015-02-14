'use strict';

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

module.exports = assign(new Dispatcher(), {
  /**
   * @param {String} type
   * @param {Object} payload
   */
  handleAction: function(type, payload) {
    this.dispatch({
      type    : type,
      payload : payload
    });
  }

});
