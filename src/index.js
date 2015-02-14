'use strict';

let React = require('react');

// export for http://fb.me/react-devtools
window.React = React;

// init data
let HNItemStoreActions = require('./actions/HNItemStoreActionsCreator');
HNItemStoreActions.initTopStories();

// bootstrap

let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let Application = require('./components/Application');
let Top = require('./components/Top');
let Story = require('./components/Story');
let User = require('./components/User');

export default Router.run(
  <Route name="app" path="/" handler={Application}>
    <Route name="story"  path="story/:storyId" handler={Story}/>
    <Route name="user"  path="user/:userId" handler={User}/>
    <DefaultRoute name="top" handler={Top}/>
  </Route>
  ,
  function(Handler, state) {
    React.render(React.createFactory(Handler)(state), document.getElementById('content'));
  }
);
