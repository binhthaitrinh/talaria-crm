import axios from 'axios';
import Meta from '../components/Meta';
import styled from 'styled-components';
import Table from '../components/styles/Table';

const Title = styled.h1`
  color: ${(props) => props.theme.primaryDark};
`;

const Container = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5rem 10rem;
  transition: all 0.5s ease-out;
`;

export default function Items(props) {
  console.log(props.items);
  return (
    <Container>
      <Meta title="Items" />
      <main>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>

              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {props.items.data.map((item) => (
              <tr key={item.id}>
                <th>{item.name}</th>
                <th>{item.pricePerItem}</th>
                <th>{item.quantiy}</th>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
    </Container>
  );
}

export async function getStaticProps(context) {
  const res = await axios.get('http://localhost:4444/api/v1/items');
  console.log(res.data.data);

  return {
    props: {
      items: res.data.data,
    },
  };
}
