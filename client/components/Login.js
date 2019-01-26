import React, { Component } from 'react';
import Router from 'next/router';
import {
  Input, Icon, Button, Form, Message,
} from 'semantic-ui-react';
import Fetch from 'react-fetch-component';
import Link from 'next/link';

import API from '../lib/api';
import { UserContext } from './Page';

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
      <UserContext.Consumer>
        {(ctx) => {
          console.log(ctx);
          return (
            <Fetch manual url={`${API.root}${API.login}`} options={API.send({ email, password })}>
              {({
                fetch, data, loading, error,
              }) => {
                if ((data && data.status === 'success') || (ctx.data && ctx.data.data.user)) {
                  return Router.push('/dashboard');
                }

                return (
                  <div>
                    {error && (
                      <Message error>
                        <Message.Header>An error occured</Message.Header>
                        {error.message}
                      </Message>
                    )}
                    <div style={{ minWidth: '35%' }}>
                      <Message
                        attached
                        header="Log in"
                        content="Enter your email address and password to log in to your account"
                      />
                      <Form className="attached fluid segment">
                        <Form.Input fluid iconPosition="left" placeholder="Email">
                          <Icon name="at" />
                          <input
                            disabled={loading}
                            type="text"
                            name="email"
                            onChange={this.saveToState}
                            value={email}
                          />
                        </Form.Input>
                        <Form.Input fluid iconPosition="left" placeholder="Password">
                          <Icon name="key" />
                          <input
                            disabled={loading}
                            type="password"
                            name="password"
                            onChange={this.saveToState}
                            value={password}
                          />
                        </Form.Input>

                        <div style={{ textAlign: 'right' }}>
                          <Button
                            style={{ marginRight: 0 }}
                            positive
                            labelPosition="right"
                            icon="chevron circle right"
                            content="Login"
                            disabled={loading || (!email.length || !password.length)}
                            loading={loading}
                            onClick={() => {
                              fetch();
                              this.setState({ email: '', password: '' });
                            }}
                          />
                        </div>
                      </Form>
                      <Message attached="bottom" warning>
                        <Icon name="help" />
                        Don't have an account?
                        <Link href="/register"> Register</Link>
                        &nbsp;instead.
                      </Message>
                    </div>
                  </div>
                );
              }}
            </Fetch>
          );
        }}
      </UserContext.Consumer>
    );
  }
}
