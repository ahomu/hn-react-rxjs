'use strict';

var Rx = require('rx');

/**
 * from https://github.com/fdecampredon/rx-react/blob/master/lib/funcSubject.js
 *
 * @returns {Rx.Observable}
 */
function create() {

  function subject(value) {
    subject.onNext(value);
  }

  for (let key in Rx.Subject.prototype) {
    subject[key] = Rx.Subject.prototype[key];
  }

  Rx.Subject.call(subject);

  return subject;
}

module.exports = {
  create: create
};
