import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 11;
`;

export default props => <Bar>{props.children}</Bar>;
