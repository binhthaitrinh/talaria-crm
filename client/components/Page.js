import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Layout from './styles/Layout';
import SidebarIcons from './SidebarIcons';
import Header from './Header';
import MainContentLayout from './styles/MainContentLayout';
import NProgress from 'nprogress';
import Router from 'next/router';
import Container from '../components/styles/Container';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const theme = {
  primary: '#00909e',
  primaryDark: '#27496d',
  primaryBlack: '#142850',
  primaryLight: '#dae1e7',
  black: '#393939',
  grey: '#3A3A3A',
  lightGrey: '#E1E1E1',
  offWhite: '#EDEDED',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const GlobalStyle = createGlobalStyle`

   *,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    font-size: 62.5%; 
}

body {
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    /*font-size: 16px;*/
    line-height: 1.7;
    color: ${(props) => props.theme.black};
    font-size: 62.5%;
}

a {
   text-decoration: none;
   color: inherit;
}

ul {
  list-style: none;
}

#__next {
  position: relative;

  width: 100%;
  height: 100vh;
  background-image: linear-gradient(to right, ${(props) =>
    props.theme.primary}, ${(props) => props.theme.primaryDark})
}


`;

class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <Header />
          <MainContentLayout>
            <SidebarIcons />
            <Container>{this.props.children}</Container>
          </MainContentLayout>
        </Layout>
        <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
        {/* <Meta /> */}
      </ThemeProvider>
    );
  }
}

export default Page;
