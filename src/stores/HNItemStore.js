'use strict';

let Rx            = require('rx/dist/rx.experimental.js');
let AppDispatcher = require('../dispatchers/AppDispatcher');

/**
 * @type {Object.<String: itemId, Rx.Subject: subject>}
 */
let ItemObservables   = {};

/**
 * @type {Object.<Number: itemId, Number: repositoryIndex>}
 */
let ItemsIndexMap     = {};

/**
 * @type {Object.<Object: item>}
 */
let ItemsRepository   = [];

/**
 * @type {Rx.Subject}
 */
let AllItemObservable = new Rx.AsyncSubject();

function setItem(item) {
  let id   = item.id;
  if (ItemsIndexMap[id]) {
    ItemsRepository[ItemsIndexMap[id]] = item;
  } else {
    ItemsRepository.push(item);
    ItemsIndexMap[id] = ItemsRepository.length - 1;
  }

  publishItem(id);
}

function publishItem(id) {
  let subject = ItemObservables[id];
  let item    = ItemsRepository[ItemsIndexMap[id]] || {};
  if (!subject) {
    subscribeItem(id);
  }
  subject.onNext(item);
  subject.onCompleted();
}

function subscribeItem(id) {
  let subject;

  if (ItemObservables[id]) {
    subject = ItemObservables[id];
  } else {
    subject = ItemObservables[id] = new Rx.AsyncSubject();
  }

  return subject.asObservable();
}

let dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case 'items:insert':
      action.payload.items.forEach(setItem);
      AllItemObservable.onNext(ItemsRepository.filter((item) => item.type !== 'comment'));
      AllItemObservable.onCompleted();
      break;
    case 'item:upsert':
      setItem(action.payload.item);
      break;
    case 'items:upsert':
      action.payload.items.forEach(setItem);
      break;
    default:
  }
});

module.exports = {
  top           : AllItemObservable.asObservable(),
  item          : subscribeItem,
  items         : (ids = []) => Rx.Observable.forkJoin(ids.map(subscribeItem)),
  dispatchToken : dispatchToken
};
