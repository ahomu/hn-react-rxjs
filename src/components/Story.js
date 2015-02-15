'use strict';

let assign = require('object-assign');
let React = require('react');
let PropTypes = React.PropTypes;
let HNItemStore = require('../stores/HNItemStore');
let ItemStory = require('../components/ItemStory');
let ItemComment = require('../components/ItemComment');
let HNItemStoreActions = require('../actions/HNItemStoreActionsCreator');

module.exports = React.createClass({

  /**
   * @property {Rx.Disposable} storySubscription
   */
  storySubscription: null,
  /**
   * @property {Rx.Disposable} commentsSubscription
   */
  commentsSubscription: null,

  propTypes: {
    storyId : PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      comments : []
    };
  },

  componentWillMount() {
    this.storySubscription = HNItemStore.item(this.props.storyId).subscribe((story) => {
      HNItemStoreActions.fetchItems(story.kids);
      // TODO parent単位でsubscribeできるようにすべき
      this.commentsSubscription = HNItemStore.items(story.kids).subscribe((comments) => {
          this.setState({comments: comments});
        });
      this.setState(story);
    });
  },

  componentWillUnmount() {
    this.storySubscription.dispose();
    this.commentsSubscription && this.commentsSubscription.dispose();
  },

  render() {
    return (
      <div className="view item-view">
        <ul>
          {ItemStory.getElement(this.state)}
        </ul>
        <ul>
          {this.state.comments.map(ItemComment.getElement)}
        </ul>
      </div>
    );
  }

});
