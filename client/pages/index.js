import Head from 'next/head';
import Meta from '../components/Meta';
import styled from 'styled-components';

const Title = styled.h1`
  color: ${(props) => props.theme.primaryDark};
`;

const Container = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 4rem 5rem;
  transition: all 0.5s ease-out;
`;

export default function Home(props) {
  return (
    <Container>
      <Meta title="Home page" />
      <main>
        <Title>asodhasdh</Title>
      </main>
    </Container>
  );
}
