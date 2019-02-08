import React, { Component } from 'react';
import { Form, Message, Button } from 'semantic-ui-react';

class PrestoSignin extends Component {
  render() {
    return (
      <div>
        <Message
          attached
          header="Sign in to Presto"
          content="Enter your username and password for your Presto account below"
        />
        <Form className="attached fluid segment">
          <Form.Field>
            <label style={{ color: 'white' }} htmlFor="username">
              Username
              <input
                id="username"
                aria-label="username"
                placeholder="Username"
                name="username"
                value={username}
                type="text"
                onChange={this.handleTextEntry}
              />
            </label>
          </Form.Field>
          <Form.Field>
            <label style={{ color: 'white' }} htmlFor="password">
              Password
              <input
                id="password"
                aria-label="password"
                placeholder="Password"
                name="password"
                value={password}
                type="password"
                onChange={this.handleTextEntry}
              />
            </label>
          </Form.Field>
        </Form>
      </div>
    );
  }
}

export default PrestoSignin;
