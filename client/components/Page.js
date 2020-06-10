import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Layout from './styles/Layout';
import SidebarIcons from './SidebarIcons';

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
    font-family: "Lato", sans-serif;
    font-weight: 400;
    /*font-size: 16px;*/
    line-height: 1.7;
    color: ${(props) => props.theme.black};
    
}

a {
   text-decoration: none;
}



`;

class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <SidebarIcons />

          {this.props.children}
        </Layout>

        {/* <Meta /> */}
      </ThemeProvider>
    );
  }
}

export default Page;
