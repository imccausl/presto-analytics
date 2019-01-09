import React, { Component } from 'react';
import {
  Input, Icon, Button, Card,
} from 'semantic-ui-react';
import Fetch from 'react-fetch-component';

import API from '../util/api';

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password } = this.state;
    return (
      <Fetch manual url={`${API.root}${API.login}`} options={API.send({ email, password })}>
        {({ fetch, loading, error }) => {
          console.log(error);
          return (
            <Card centered raised style={{ width: '400px' }}>
              <Card.Content>
                <Card.Header>Sign in</Card.Header>
                <Card.Description style={{ marginBottom: '15px' }}>
                  Enter your email address and password below.
                </Card.Description>
                <Input
                  style={{ marginBottom: '5px' }}
                  fluid
                  iconPosition="left"
                  placeholder="Email"
                >
                  <Icon name="at" />
                  <input
                    disabled={loading}
                    type="text"
                    name="email"
                    onChange={this.saveToState}
                    value={email}
                  />
                </Input>
                <Input fluid iconPosition="left" placeholder="Password">
                  <Icon name="key" />
                  <input
                    disabled={loading}
                    type="password"
                    name="password"
                    onChange={this.saveToState}
                    value={password}
                  />
                </Input>
              </Card.Content>
              <Card.Content extra style={{ textAlign: 'right' }}>
                <Button
                  positive
                  labelPosition="right"
                  icon="chevron circle right"
                  content="Login"
                  disabled={loading}
                  loading={loading}
                  onClick={() => {
                    fetch();
                    this.setState({ email: '', password: '' });
                  }}
                />
              </Card.Content>
            </Card>
          );
        }}
      </Fetch>
    );
  }
}
