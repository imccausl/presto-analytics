import 'semantic-ui-less/semantic.less';

import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Login from './routes/Login';
import Register from './routes/Register';
import Settings from './routes/Settings';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login} />
      <Route path="/settings" component={Settings} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
  );
}

export default App;
