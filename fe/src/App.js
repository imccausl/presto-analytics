import "semantic-ui-less/semantic.less";

import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Register from "./routes/Register";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;
