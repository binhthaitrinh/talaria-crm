import React from 'react';
import MainStyle from './styles/Main';
import styled from 'styled-components';

const Title = styled.h1`
  color: ${(props) => props.theme.primaryBlack};
  font-size: 2rem;
`;

function Main(props) {
  return (
    <MainStyle>
      <Title>Hello</Title>
    </MainStyle>
  );
}

export default Main;
