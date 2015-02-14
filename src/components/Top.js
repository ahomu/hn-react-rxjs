'use strict';

let React = require('react');
let HNItemStore = require('../stores/HNItemStore');
let ItemStory = require('../components/ItemStory');

module.exports = React.createClass({

  /**
   * @property {Rx.Disposable} subscription
   */
  subscription: null,

  getInitialState() {
    return {
      stories: []
    };
  },

  componentWillMount() {
    this.subscription = HNItemStore.top.subscribe((stories) => {
      this.setState({stories: stories})
    });
  },

  componentWillUnmount() {
    this.subscription.dispose();
  },

  render() {
    return (
      <div className="view news-view">
        <ol>
          {this.state.stories.map(ItemStory.getElement)}
        </ol>
      </div>
    );
  }

});
