import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Header, Icon, Card, Form, Segment, Dropdown,
} from 'semantic-ui-react';

import { timingSafeEqual } from 'crypto';
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
  };

  handleFieldChange = e => {
    const { name, value } = e.target;
    console.log(name, value);
    this.setState({ [name]: value });
  };

  render() {
    console.log('PROPS:', this.props);
    const {
      firstName, lastName, email, monthlyPassCost, fareCost,
    } = this.state;
    const { open, close } = this.props;

    return (
      <>
        <Header icon="setting" content="Account Settings" />
        <Header as="h3" attached="top">
          <Icon name="user" />
          Personal Information
        </Header>
        <Segment attached piled>
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
          </Form>
        </Segment>

        <Header as="h3" attached="top">
          <Icon name="bus" />
          Transit Costs
        </Header>
        <Segment attached piled>
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
          </Form>
        </Segment>
        <Button
          color="red"
          onClick={() => {
            close();
          }}
        >
          <Icon name="remove" />
          Cancel
        </Button>
        <Button
          color="green"
          onClick={async () => {
            const response = await requestApi.updateBudget({
              monthlyPassCost,
              fareCost,
            });
            console.log(response);
            close();
          }}
        >
          <Icon name="checkmark" />
          Save
        </Button>
      </>
    );
  }
}

export default AccountSettings;
