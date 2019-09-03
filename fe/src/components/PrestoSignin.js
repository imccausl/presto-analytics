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
    isError: false,
    errorMessage: '',
    cards: [],
  };

  handleTextEntry = e => {
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const {
      username,
      password,
      cards,
      inProgress,
      progressMessage,
      isError,
      errorMessage,
    } = this.state;
    const { incrementSteps, update, closeModal } = this.props;

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

            if (update) {
              closeModal();
            } else {
              incrementSteps();
            }
          }

          const showHeader = () => {
            if (loading || inProgress) {
              return (
                <Message attached icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>One Moment...</Message.Header>
                    {progressMessage}
                  </Message.Content>
                </Message>
              );
            }

            if (isError) {
              return (
                <Message attached icon negative>
                  <Icon name="delete" />

                  <Message.Content>
                    <Message.Header>An Error Occurred</Message.Header>
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
                <div>
                  <Button
                    positive
                    labelPosition="right"
                    icon="chevron circle right"
                    content="Next"
                    disabled={loading || inProgress || !username || !password}
                    onClick={async () => {
                      this.setState({
                        inProgress: true,
                        progressMessage: 'Logging into PRESTO...',
                      });

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
                      } else if (response.error && response.message === 'INVALID_LOGIN') {
                        this.setState({
                          inProgress: false,
                          isError: true,
                          progressMessage:
                            "You've entered an incorrect Presto username or password.",
                        });
                      }
                    }}
                  >
                    <Icon name="checkmark" />
                    {`${
                      update
                        ? inProgress && progressMessage === 'Complete!'
                          ? ' Close'
                          : ' Update'
                        : ' Next'
                    }`}
                  </Button>
                  {update && (
                    <Button
                      negative
                      content="Cancel"
                      disabled={inProgress}
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      {' Cancel'}
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          );
        }}
      </Fetch>
    );
  }
}
