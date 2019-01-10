import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';

export default (props) => {
  const {
    user: { balance, cardNumber },
  } = props;

  return (
    <Container textAlign="center">
      <Header as="h2" style={{ fontSize: '5em', margin: '0' }}>
        {balance.replace('$', '')}
      </Header>
      <div>{cardNumber}</div>
    </Container>
  );
};
