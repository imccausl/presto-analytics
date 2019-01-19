import PropTypes from 'prop-types';
import styled from 'styled-components';

const Label = styled.h3`
  font-size: 1.1em;
  text-transform: capitalize;
  color: ${props => props.labelColor || '#9ec0ff'};
  margin: 0;
`;

const Container = styled.div`
  text-align: center;
  border-radius: 0.25em;
  margin-right: 0;
  margin-left: 50px;
`;

const Content = styled.h2`
  font-size: 2em;
  margin: 0;
`;

const Footer = styled.h3`
  font-size: 1em;
  margin: 0;
`;

export default (props) => {
  const { label, value, labelColor } = props;

  return (
    <Container>
      <Content>{value}</Content>
      <Label labelColor={labelColor}>{label}</Label>
    </Container>
  );
};
