import axios from 'axios';
import Meta from '../../components/Meta';
import styled from 'styled-components';
import Table from '../../components/styles/Table';
import Item from '../../components/Item';
import LinkPrimary from '../../components/styles/LinkPrimary';
import Link from 'next/link';
import Title from '../../components/styles/Title';
import PageHeader from '../../components/styles/PageHeader';

const Container = styled.div`
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  padding: 4rem 5rem;
`;

export default function Items(props) {
  console.log(props.items);
  return (
    <>
      <Meta title="Items" />
      <main>
        <PageHeader>
          <div className="page-title">
            <Title>Items</Title>
          </div>
          <div className="action-btn">
            <Link href="/items/new" passHref>
              <LinkPrimary>Create an Item</LinkPrimary>
            </Link>
          </div>
        </PageHeader>

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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.items.data.map((item, index) => (
              <Item item={item} key={item.id} index={index} />
            ))}
          </tbody>
        </Table>
      </main>
    </>
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
