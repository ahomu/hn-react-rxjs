'use strict';

// This module is unused (concept memo)

let Firebase = require('firebase');
let api      = new Firebase('https://hacker-news.firebaseio.com/v0');
let Rx       = require('rx/dist/rx.experimental.js');

let topStories = Rx.Observable.create(function(observer) {
  api.child('topstories').on('value', function(snapshot) {
    getItems(snapshot.val()).subscribe(function(items) {
      observer.onNext(items);
    });
  });
});

/**
 * @param {Number} id
 */
function getItem(id) {
  return Rx.Observable.create(function(observer) {
    api.child('item/' + id).once('value', function(snapshot) {
      observer.onNext(snapshot.val());
      observer.onCompleted();
    });
  });
}

/**
 * @param {Array.<Number>} [id=[]]
 * @returns {Observable|Rx.Observable<TResult>}
 */
function getItems(ids = []) {
  return Rx.Observable.forkJoin(ids.map(getItem))
}

/**
 * @param {Number} id
 */
function getUser(id) {
  return Rx.Observable.create(function(observer) {
    api.child('user/' + id).once('value', function(snapshot) {
      observer.onNext(snapshot.val());
      observer.onCompleted();
    });
  });
}

module.exports = {
  topStories : () => topStories,
  user       : getUser,
  item       : getItem,
  items      : getItems
};
