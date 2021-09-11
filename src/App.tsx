import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Main from './components/Main/Main';
import PollCreator from './components/PollCreator/PollCreator';
import PollResults from './components/PollResults/PollResults';
import PollVoter from './components/PollVoter/PollVoter';
import { GlobalStyleProps, Theme } from './interfaces';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-size: 10px;
    font-family: sans-serif;
    color: ${({ theme }: GlobalStyleProps) => theme.dark};
  }

  body, html {
    overflow-x: hidden;
  }

  body {
    width: 100vw;
    min-height: 100vh;

    background-color: ${({ theme }: GlobalStyleProps) => theme.background};
  }

  svg {
    fill: ${({ theme }: GlobalStyleProps) => theme.dark};
  }
`;

const theme: Theme = {
  background: '#EFEFEF',
  dark: '#202020',
  light: '#d3d3d3',
};

const MainTitle = styled.h1`
  font-size: 4.8em;
`;

const MainSubtitle = styled.p`
  font-size: 1.6em;
`;

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Main>
          <MainTitle>ballot</MainTitle>
          <MainSubtitle>Fast and easy polls</MainSubtitle>
          <Switch>
            <Route exact path='/'>
              <PollCreator />
            </Route>
            <Route exact path='/:pollid'>
              <PollVoter />
            </Route>
            <Route exact path='/:pollid/r'>
              <PollResults />
            </Route>
            <Redirect exact to='/error' />
          </Switch>
        </Main>
      </ThemeProvider>
    </Router>
  );
};

export default App;
