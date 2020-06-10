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
  padding: 4rem 5rem;
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
              <th>Created At</th>
              <th>Tracking Link</th>
              <th>Item Link</th>
              <th>City</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {props.items.data.map((item) => (
              <tr key={item.id}>
                <th>
                  {new Date(item.createdAt).toLocaleString('en-us', {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </th>
                <th>
                  <a href={item.trackingLink}>
                    {item.trackingLink.slice(0, 20)}...
                  </a>
                </th>
                <th>
                  <a href={item.link}>{item.link.slice(0, 20)}...</a>
                </th>
                <th>{item.name}</th>
                <th>{item.name}</th>
                <th>
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.pricePerItem)}
                </th>
                <th>{item.quantity}</th>
                <th>{item.notes}</th>
                <th>{item.status}</th>
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
