'use strict';

let Rx            = require('rx/dist/rx.experimental.js');
let AppDispatcher = require('../dispatchers/AppDispatcher');

/**
 * @type {Object.<Number: userId, Object: user>}
 */
let UserRepository  = {};

/**
 * @type {Object.<Number: userId, Object: Rx.Subject>}
 */
let UserObservables = {};

function setUser(user) {
  let id   = user.id;
  UserRepository[id] = user;
  publishUser(id);
}

function publishUser(id) {
  let subject = UserObservables[id];
  let user    = UserRepository[id] || {};
  if (subject) {
    subject.onNext(user);
    subject.onCompleted();
  }
}

function subscribeUser(id) {
  let subject;

  if (UserObservables[id]) {
    subject = UserObservables[id];
  } else {
    subject = UserObservables[id] = new Rx.AsyncSubject();
  }

  return subject.asObservable();
}

let dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case 'user:upsert':
      setUser(action.payload.user);
      break;
    default:
  }
});

module.exports = {
  user          : subscribeUser,
  dispatchToken : dispatchToken
};
