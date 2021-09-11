import React from 'react';
import styled from 'styled-components';
import { ChildrenProps } from '../../interfaces';

const MainWrapper = styled.main`
  width: 100vw;
  min-height: 100vh;

  padding: 5vmin;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;

  font-size: 2.4vmin;
`;

const Main: React.FC<ChildrenProps> = ({ children }) => {
  return <MainWrapper>{children}</MainWrapper>;
};

export default Main;
