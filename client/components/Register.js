import React, { Component } from 'react';

import NProgress from 'nprogress';
import {
  Button, Message, Form, Icon,
} from 'semantic-ui-react';
import Fetch from 'react-fetch-component';

import API from '../lib/api';

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
            <div>
              <Message
                attached
                header="Presto Analytics"
                content="Fill out the form below to sign-up for a new account"
              />
              <Form className="attached fluid segment">
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={this.saveToState}
                    name="firstName"
                    disabled={loading}
                  />
                  <Form.Input
                    fluid
                    label="Last Name"
                    placeholder="Last Name"
                    type="text"
                    name="lastName"
                    onChange={this.saveToState}
                    value={lastName}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Input
                  fluid
                  placeholder="Email"
                  label="Email"
                  disabled={loading}
                  type="text"
                  name="email"
                  onChange={this.saveToState}
                  value={email}
                />
                <Form.Input
                  fluid
                  placeholder="Password"
                  label="Password"
                  disabled={loading}
                  type="password"
                  name="password"
                  onChange={this.saveToState}
                  value={password}
                />
                <Form.Input
                  fluid
                  placeholder="Password Again"
                  disabled={loading}
                  label="Password Again"
                  type="password"
                  name="passwordAgain"
                  onChange={this.saveToState}
                  value={passwordAgain}
                />
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
              </Form>
              <Message attached="bottom" warning>
                <Icon name="help" />
                Already signed up?&nbsp;
                <a href="#">Login here</a>
                &nbsp;instead.
              </Message>
            </div>
          );
        }}
      </Fetch>
    );
  }
}
