import React, { Component } from 'react';

import NProgress from 'nprogress';
import {
  Button, Message, Form, Icon,
} from 'semantic-ui-react';
import Fetch from 'react-fetch-component';
import Link from 'next/link';

import API from '../lib/api';

export default class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordAgain: '',
  };

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
            this.props.incrementSteps();
          }

          const handleError = () => {
            NProgress.done();
            return (
              <div>
                ERROR:
                {error.message}
              </div>
            );
          };

          return (
            <div style={{ minWidth: '50%' }}>
              <Message
                attached
                header="Register"
                content="Fill out the form below to sign-up for a new account"
              />

              {error && handleError()}

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

                <Form.Group widths="equal">
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
                </Form.Group>

                <Button
                  positive
                  labelPosition="right"
                  icon="chevron circle right"
                  content="Next"
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
                <Link href="/login">Login</Link>
                &nbsp;instead.
              </Message>
            </div>
          );
        }}
      </Fetch>
    );
  }
}
