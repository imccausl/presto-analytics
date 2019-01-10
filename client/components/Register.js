import React, { Component } from 'react';

import NProgress from 'nprogress';
import {
  Input, Icon, Button, Card,
} from 'semantic-ui-react';
import Fetch from 'react-fetch-component';

import API from '../util/api';

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordAgain: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      firstName, lastName, email, password, passwordAgain,
    } = this.state;
    return (
      <Fetch
        manual
        url={`${API.root}${API.register}`}
        options={API.send({
          firstName,
          lastName,
          email,
          password,
          passwordAgain,
        })}
      >
        {({
          fetch, loading, data, error,
        }) => {
          if (data) {
            NProgress.done();
          }

          if (error) {
            NProgress.done();
            return (
              <div>
                ERROR:
                {error.message}
              </div>
            );
          }

          return (
            <Card centered raised style={{ width: '400px' }}>
              <Card.Content>
                <Card.Header>Create an Account</Card.Header>
                <Card.Description style={{ marginBottom: '15px' }}>
                  Enter your account details below to create your account.
                </Card.Description>
                <Input
                  style={{ marginBottom: '5px' }}
                  fluid
                  iconPosition="left"
                  placeholder="First Name"
                >
                  <Icon name="user circle" />
                  <input
                    disabled={loading}
                    type="text"
                    name="firstName"
                    onChange={this.saveToState}
                    value={firstName}
                  />
                </Input>
                <Input
                  style={{ marginBottom: '5px' }}
                  fluid
                  iconPosition="left"
                  placeholder="Last Name"
                >
                  <Icon name="user circle" />
                  <input
                    disabled={loading}
                    type="text"
                    name="lastName"
                    onChange={this.saveToState}
                    value={lastName}
                  />
                </Input>
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
                <Input
                  style={{ marginBottom: '5px' }}
                  fluid
                  iconPosition="left"
                  placeholder="Password"
                >
                  <Icon name="key" />
                  <input
                    disabled={loading}
                    type="password"
                    name="password"
                    onChange={this.saveToState}
                    value={password}
                  />
                </Input>
                <Input fluid iconPosition="left" placeholder="Password Again">
                  <Icon name="key" />
                  <input
                    disabled={loading}
                    type="password"
                    name="passwordAgain"
                    onChange={this.saveToState}
                    value={passwordAgain}
                  />
                </Input>
              </Card.Content>
              <Card.Content extra style={{ textAlign: 'right' }}>
                <Button
                  positive
                  labelPosition="right"
                  icon="chevron circle right"
                  content="Sign Up"
                  disabled={
                    loading
                    || (!firstName
                      || !lastName
                      || !email
                      || !password
                      || !passwordAgain
                      || password !== passwordAgain)
                  }
                  loading={loading}
                  onClick={() => {
                    NProgress.start();
                    fetch();

                    this.setState({
                      firstName: '',
                      lastName: '',
                      email: '',
                      password: '',
                      passwordAgain: '',
                    });
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
