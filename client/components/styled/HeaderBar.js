import styled from 'styled-components';

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 500px;
  background: linear-gradient(to bottom, #5558c8, #3370ff);
`;

export default props => (
  <Container>
    <Bar>{props.children}</Bar>
  </Container>
);
