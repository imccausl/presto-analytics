import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import {
  Dimmer, Loader, Form, Message, Icon, Button, Segment,
} from 'semantic-ui-react';

import API from '../lib/api';
import requestApi from '../lib/requestApi';

export default class PrestoSignin extends Component {
  state = {
    username: '',
    password: '',
    inProgress: false,
    progressMessage: 'Fetching Data from Presto...',
    cards: [],
  };

  handleTextEntry = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const {
      username, password, cards, inProgress, progressMessage,
    } = this.state;
    const { incrementSteps } = this.props;

    if (cards) {
      console.log(cards.map(card => card.cardNumber));
    }
    return (
      <Fetch
        manual
        url={`${API.root}${API.prestoUsage}`}
        options={API.send({ from: '01/01/2018', cards: cards.map(card => card.cardNumber) })}
      >
        {({
          fetch, data, error, loading,
        }) => {
          console.log(data);
          if (!loading && data) {
            this.setState({ inProgress: false, progressMessage: 'Complete!' });
            incrementSteps();
          }

          const showHeader = () => {
            if (loading || inProgress) {
              return (
                <Message attached icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>One moment</Message.Header>
                    {progressMessage}
                  </Message.Content>
                </Message>
              );
            }

            return (
              <Message
                attached
                header="Sign in to Presto"
                content="Enter your username and password to gather your presto data"
              />
            );
          };

          return (
            <div>
              {showHeader()}
              <Form className="attached fluid segment">
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    placeholder="Username"
                    label="Username"
                    disabled={loading || inProgress}
                    type="text"
                    name="username"
                    onChange={this.handleTextEntry}
                    value={username}
                  />
                  <Form.Input
                    fluid
                    placeholder="Password"
                    label="Password"
                    disabled={loading || inProgress}
                    type="password"
                    name="password"
                    onChange={this.handleTextEntry}
                    value={password}
                  />
                </Form.Group>
                <Button
                  positive
                  labelPosition="right"
                  icon="chevron circle right"
                  content="Next"
                  disabled={loading || inProgress || !username || !password}
                  onClick={async () => {
                    this.setState({ inProgress: true, progressMessage: 'Logging into PRESTO...' });
                    const isLoggedIn = await requestApi.prestoIsLoggedIn();
                    console.log(isLoggedIn);
                    if (
                      isLoggedIn.status === 'error'
                      && isLoggedIn.message === 'Not logged in to Presto'
                    ) {
                      this.setState({
                        inProgress: true,
                        progressMessage: 'Getting account data...',
                      });
                      const response = await requestApi.prestoLogin(username, password);
                      console.log(response);
                      if (response.cards) {
                        this.setState({
                          cards: response.cards,
                          inProgress: true,
                          progressMessage: 'Fetching PRESTO usage data...',
                        });

                        fetch();
                      }
                    } else if (isLoggedIn.status === 'success') {
                      // fetch();
                    }
                  }}
                >
                  <Icon name="checkmark" />
                  {' Next'}
                </Button>
              </Form>
            </div>
          );
        }}
      </Fetch>
    );
  }
}
