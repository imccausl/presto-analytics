import React, { Component } from 'react';
import {
  Container, Header, Icon, Step, Segment,
} from 'semantic-ui-react';

import RegisterAccount from './RegisterAccount';

class Register extends Component {
  state = {
    activeStep: 1,
    completedSteps: 0,
  };

  render() {
    const { activeStep, completedSteps } = this.state;

    return (
      <Container>
        <Segment basic textAlign="center">
          <Step.Group ordered>
            <Step active={activeStep === 1} completed={completedSteps > 1}>
              <Icon name="user" />
              <Step.Content>
                <Step.Title>Sign Up</Step.Title>
                <Step.Description>Sign up for your account</Step.Description>
              </Step.Content>
            </Step>

            <Step active={activeStep === 2} completed={completedSteps > 2}>
              <Icon name="subway" />
              <Step.Content>
                <Step.Title>Presto</Step.Title>
                <Step.Description>Sign in to Presto</Step.Description>
              </Step.Content>
            </Step>

            <Step active={activeStep === 3} completed={completedSteps > 3}>
              <Icon name="bullseye" />
              <Step.Content>
                <Step.Title>Finalize</Step.Title>
              </Step.Content>
            </Step>
          </Step.Group>
        </Segment>

        <Segment basic>
          <RegisterAccount />
        </Segment>
      </Container>
    );
  }
}

export default Register;
