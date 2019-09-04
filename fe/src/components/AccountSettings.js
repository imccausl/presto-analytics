import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import {
  Button, Header, Icon, Popup, Form, Segment, Grid, Message,
} from 'semantic-ui-react';

import requestApi from '../lib/requestApi';

class AccountSettings extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      monthlyPassCost: PropTypes.string,
      fareCost: PropTypes.string,
    }),
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    budget: PropTypes.shape({
      monthlyPassCost: '146.25',
      fareCost: '3.00',
    }),
  };

  state = {
    firstName: this.props.props.data.user.firstName,
    lastName: this.props.props.data.user.lastName,
    email: this.props.props.data.user.email,
    monthlyPassCost: this.props.props.data.budget
      ? this.props.props.data.budget.monthlyPassCost
      : 0,
    fareCost: this.props.props.data.budget ? this.props.props.data.budget.fareCost : 0,
    updateMessage: '',
  };

  handleFieldChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleDeleteAccount = async () => {
    const response = await requestApi.deleteAccount();
    if (response.status === 'success') {
      this.props.history.push('/login');
    }
  };

  handleUpdateUserDetails = async userId => {
    const { firstName, lastName, email } = this.state;

    const userDetails = {
      firstName,
      lastName,
      email,
    };

    const response = await requestApi.updateUserDetails(userId, userDetails);

    if (response.status === 'success') {
      this.setState({ updateMessage: 'Account details successfully updated.' });
    }
  };

  handleUpdateBudgetDetails = async () => {
    const { monthlyPassCost, fareCost } = this.state;

    const budgetDetails = {
      monthlyPassCost,
      fareCost,
    };

    const response = await requestApi.updateBudget(budgetDetails);

    if (response.status === 'success') {
      this.setState({ updateMessage: 'Budget details successfully updated.' });
    }
  };

  render() {
    const {
      firstName, lastName, email, monthlyPassCost, fareCost, updateMessage,
    } = this.state;

    const { id } = this.props.props.data.user;

    return (
      <div>
        <Header as="h2">
          Account Settings
          <Header.Subheader>Manage your account settings</Header.Subheader>
        </Header>

        {updateMessage && (
          <Message positive header="Account Details Updated" content={updateMessage} />
        )}

        <Header as="h3" attached="top">
          <Icon name="user" />
          Personal Information
        </Header>

        <Segment attached>
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="firstName">
                  First Name
                  <input
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    name="firstName"
                    onChange={this.handleFieldChange}
                  />
                </label>
              </Form.Field>
              <Form.Field>
                <label htmlFor="lastName">
                  Last Name
                  <input
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    name="lastName"
                    onChange={this.handleFieldChange}
                  />
                </label>
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="email">
                  Email
                  <input
                    id="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={this.handleFieldChange}
                  />
                </label>
              </Form.Field>
              <Form.Field>
                <label htmlFor="password">
                  Password
                  <input id="password" placeholder="Password" onChange={this.handleFieldChange} />
                </label>
              </Form.Field>
            </Form.Group>
            <Button positive onClick={() => this.handleUpdateUserDetails(id)}>
              Save
            </Button>
          </Form>
        </Segment>

        <Header as="h3" attached="top">
          <Icon name="bus" />
          Transit Costs
        </Header>
        <Segment attached>
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="monthlyPassCost">
                  Monthly Pass Cost
                  <input
                    type="number"
                    id="monthlyPassCost"
                    placeholder="Monthly Pass Cost"
                    value={monthlyPassCost}
                    name="monthlyPassCost"
                    onChange={this.handleFieldChange}
                  />
                </label>
              </Form.Field>
              <Form.Field>
                <label htmlFor="fareCost">
                  Single Fare Cost
                  <input
                    type="number"
                    id="fareCost"
                    placeholder="Single Fare Cost"
                    value={fareCost}
                    name="fareCost"
                    onChange={this.handleFieldChange}
                  />
                </label>
              </Form.Field>
            </Form.Group>
            <Button positive onClick={() => this.handleUpdateBudgetDetails()}>
              Save
            </Button>
          </Form>
        </Segment>

        <Header as="h3" attached="top" color="red">
          <Icon name="delete" />
          Delete Account
        </Header>

        <Segment attached color="red" textAlign="center">
          <Popup
            trigger={<Button color="red" icon="cancel" content="Delete My Account" />}
            on="click"
            position="top right"
          >
            <Grid centered>
              <Grid.Column textAlign="center">
                <p>This action cannot be undone</p>
                <Button
                  color="green"
                  content="Confirm Delete"
                  onClick={() => this.handleDeleteAccount()}
                />
              </Grid.Column>
            </Grid>
          </Popup>
        </Segment>
      </div>
    );
  }
}

export default withRouter(AccountSettings);
