import "semantic-ui-less/semantic.less";

import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Dashboard from "./routes/Dashboard";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;
