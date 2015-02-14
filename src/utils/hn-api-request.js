'use strict'

let agent    = require('superagent');
let Rx       = require('rx/dist/rx.experimental.js');

const ROOT_URL = 'https://hacker-news.firebaseio.com';
const VERSION  = 'v0';

module.exports = function(path) {
  return Rx.Observable.create(function(observer) {
    agent.get(`${ROOT_URL}/${VERSION}/${path}`, function(resp) {
      observer.onNext(resp.body);
      observer.onCompleted();
    });
  })
};
