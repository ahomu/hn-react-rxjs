'use strict';

let assign = require('object-assign');
let React = require('react');
let PropTypes = React.PropTypes;
let HNItemStore = require('../stores/HNItemStore');
let HNItemStoreActions = require('../actions/HNItemStoreActionsCreator');
let handler = require('../utils/observable-handler');
let helper = require('../utils/view-helper');

let ItemComment = React.createClass({
  /**
   * @property {Object.<String, Rx.Observable>} handlers
   */
  handlers: null,

  /**
   * @property {Rx.Disposable} subscription
   */
  subscription: null,

  /**
   * @property {Object} statics
   */
  statics: {
    /**
     * @param {Object} comment
     * @returns {ReactElement}
     */
    getElement(comment) {
      if (comment.deleted) {
        return null;
      }
      return <ItemComment {...comment} key={comment.id} />;
    }
  },

  /**
   * @property {String} displayName
   */
  displayName: 'ItemComment',

  /**
   * @property {Object.<String, PropTypes>} propTypes
   */
  propTypes: {
    kids : PropTypes.array
  },

  getInitialState() {
    return assign({}, {
      children     : [],
      showChildren : true
    });
  },

  componentWillMount() {
    HNItemStoreActions.fetchItems(this.props.kids);
    this.subscription = HNItemStore.items(this.props.kids).subscribe((children) => {
      this.setState({children: children});
    });

    this.handlers = {
      toggleChildren: handler.create()
    };
    this.handlers.toggleChildren
      .scan(this.state.showChildren, (acc) => !acc)
      .subscribe((v) => this.setState({showChildren: v}));
  },

  componentWillUnmount() {
    this.subscription.dispose();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    let notEqualIds = nextProps.id !== this.props.id;
    let notEqualChildren = nextState.children.length !== this.state.children.length;
    let notEqualShow = nextState.showChildren !== this.state.showChildren;
    return notEqualIds || notEqualChildren || notEqualShow;
  },

  render() {
    return (
      <li>
        <div className="comhead">
          <a className="toggle" onClick={this.handlers.toggleChildren}>
            [{this.state.showChildren ? '-' : '+'}]
          </a>
          <a>{this.props.by}</a>
          <span> {helper.relativeTime(this.props.time)} ago</span>
        </div>
        <div className="comment-content" dangerouslySetInnerHTML={{__html: this.props.text}}></div>
        <ul className={this.state.showChildren ? 'child-comments' : 'is-hidden'}>
          {this.state.children.map(ItemComment.getElement)}
        </ul>
      </li>
    );
  }
});

module.exports = ItemComment;
