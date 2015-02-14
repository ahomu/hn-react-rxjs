'use strict';

let React = require('react');
let PropTypes = React.PropTypes;
let Router = require('react-router');
let handler = require('../utils/observable-handler');
let helper = require('../utils/view-helper');

let ItemStory = React.createClass({
  /**
   * @property {Object.<String, Rx.Observable>} handlers
   */
  handlers: null,

  /**
   * @property {Object} statics
   */
  statics: {
    /**
     * @param {Object} story
     * @returns {ReactElement}
     */
    getElement(story) {
      return <ItemStory {...story} key={story.id} />;
    }
  },

  /**
   * @property {Array} mixins
   */
  mixins: [Router.Navigation],

  /**
   * @property {String} displayName
   */
  displayName: 'ItemStory',

  getDefaultProps() {
    return {
      kids: []
    };
  },

  componentWillMount() {
    this.handlers = {
      toComments : handler.create(),
      toUser     : handler.create()
    };

    this.handlers.toComments.subscribe((e) => {
      this.transitionTo(`/story/${this.props.id}`);
    });

    this.handlers.toUser.subscribe((e) => {
      this.transitionTo(`/user/${this.props.by}`);
    });
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.id !== this.props.id;
  },

  render() {
    return (
      <li className="item">
        <p>
          <a className="title" href={this.props.url} target="_blank">{this.props.title}</a>
          <span className="domain"> ({helper.host(this.props.url)})</span>
        </p>
        <p className="subtext">
          <span>
            {this.props.score} points by <a onClick={this.handlers.toUser}>{this.props.by}</a>
          </span>
          <span> {helper.relativeTime(this.props.time)} ago</span>
          <span className="comments-link">
            | <a onClick={this.handlers.toComments}>{this.props.kids.length} comments</a>
          </span>
        </p>
      </li>
    );
  }
});

module.exports = ItemStory;
