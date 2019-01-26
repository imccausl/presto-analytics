import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import {
  Dimmer, Loader, Form, Modal, Header, Icon, Button,
} from 'semantic-ui-react';

import API from '../../lib/api';
import requestApi from '../../lib/requestApi';

export default class UpdatePresto extends Component {
  state = { open: false, username: '', password: '' };

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open });
    }
  }

  handleTextEntry = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const { open, username, password } = this.state;

    return (
      <Fetch
        manual
        url={`${API.root}${API.prestoUsage}`}
        options={API.send({ from: '01/01/2018' })}
      >
        {({
          fetch, data, error, loading,
        }) => {
          if (loading) {
            return (
              <Dimmer active>
                <Loader />
              </Dimmer>
            );
          }

          return (
            <Modal open={open} basic size="small">
              <Header open icon="subway" content="Log in to your Presto account" />
              <Modal.Content>
                <p>
                  Enter your username and password below to gather the data from your Presto account
                </p>
                <Form>
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
              </Modal.Content>

              <Modal.Actions>
                <Button basic color="red" inverted onClick={() => this.setState({ open: false })}>
                  <Icon name="remove" />
                  {' Cancel'}
                </Button>
                <Button
                  color="green"
                  inverted
                  onClick={async () => {
                    const response = await requestApi.prestoLogin(username, password);
                    console.log(response);
                    fetch();
                  }}
                >
                  <Icon name="checkmark" />
                  {' OK'}
                </Button>
              </Modal.Actions>
            </Modal>
          );
        }}
      </Fetch>
    );
  }
}
