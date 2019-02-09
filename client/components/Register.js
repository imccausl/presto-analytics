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

  incrementSteps = () => {
    const { activeStep, completedSteps } = this.state;

    this.setState({ activeStep: activeStep + 1, completedSteps: completedSteps + 1 });
  };

  render() {
    const { activeStep, completedSteps } = this.state;
    console.log(completedSteps > 0, activeStep);
    return (
      <Container>
        <Segment basic textAlign="center">
          <Step.Group ordered>
            <Step active={activeStep === 1} completed={completedSteps > 0}>
              <Step.Content>
                <Step.Title>Sign Up</Step.Title>
                <Step.Description>Sign up for your account</Step.Description>
              </Step.Content>
            </Step>

            <Step active={activeStep === 2} completed={completedSteps > 1}>
              <Step.Content>
                <Step.Title>Presto</Step.Title>
                <Step.Description>Sign in to Presto</Step.Description>
              </Step.Content>
            </Step>

            <Step active={activeStep === 3} completed={completedSteps > 2}>
              <Step.Content>
                <Step.Title>Finalize</Step.Title>
              </Step.Content>
            </Step>
          </Step.Group>
        </Segment>

        <Segment basic>
          {activeStep === 1 && <RegisterAccount incrementSteps={this.incrementSteps} />}
          {activeStep === 2 && <div />}
          {activeStep === 3 && <div />}
        </Segment>
      </Container>
    );
  }
}

export default Register;
