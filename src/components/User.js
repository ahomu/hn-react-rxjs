'use strict';

let assign = require('object-assign');
let React = require('react');
let PropTypes = React.PropTypes;
let HNUserStore = require('../stores/HNUserStore');
let HNUserStoreActions = require('../actions/HNUSerStoreActionsCreator');
let helper = require('../utils/view-helper');

module.exports = React.createClass({

  /**
   * @property {Rx.Disposable} subscription
   */
  subscription: null,

  /**
   * @property {Rx.Disposable} commentsSubscription
   */
  commentsSubscription: null,

  /**
   * @property {Object.<String, PropTypes>} propTypes
   */
  propTypes: {
    userId : PropTypes.string.isRequired
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    HNUserStoreActions.fetchUser(this.props.userId);
    this.subscription = HNUserStore.user(this.props.userId).subscribe((user) => {
      console.log('receive', user);
      this.setState(user);
    });
  },

  componentWillUnmount() {
    this.subscription.dispose();
  },

  render() {
    return (
      <div className="view user-view">
        <ul>
          <li><span className="label">user:</span> {this.state.id}</li>
          <li><span className="label">created:</span> {helper.relativeTime(this.state.created)} ago</li>
          <li><span className="label">karma:</span> {this.state.karma}</li>
          <li>
            <span className="label">about:</span>
            <div className="about" v-html="user.about"></div>
          </li>
        </ul>
        <p className="links">
          <a href={`https://news.ycombinator.com/submitted?id=${this.state.id}`}>submissions</a><br />
          <a href={`https://news.ycombinator.com/threads?id=${this.state.id}`}>comments</a>
        </p>
      </div>
    );
  }

});
