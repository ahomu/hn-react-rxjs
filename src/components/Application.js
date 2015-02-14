'use strict';

let React = require('react');
let PropTypes = React.PropTypes;
var RouteHandler = require('react-router').RouteHandler;
var Link = require('react-router').Link;

module.exports = React.createClass({

  propTypes: {
    params: PropTypes.object.isRequired
  },

  render() {
    return (
      <div>
        <div id="header">
          <a id="yc" href="http://www.ycombinator.com">
            <img src="https://news.ycombinator.com/y18.gif" />
          </a>
          <h1><Link to="/">Hacker News</Link></h1>
          <span className="source">
            Built with <a href="https://github.com/facebook/react" target="_blank">React</a>,
            <a href="https://github.com/Reactive-Extensions/RxJS" target="_blank">RxJS</a> |
            <a href="https://github.com/ahomu/hn-react-rxjs" target="_blank">Source</a>
          </span>
        </div>
        <RouteHandler {...this.props.params} />
      </div>
    );
  }

});
