import Head from 'next/head';
import Meta from '../components/Meta';
import styled from 'styled-components';

const Title = styled.h1`
  color: ${(props) => props.theme.primaryDark};
`;

export default function Home(props) {
  return (
    <>
      <Meta title="Home page" />
      <main>
        <Title>asodhasdh</Title>
      </main>
    </>
  );
}
