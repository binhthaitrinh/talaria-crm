import axios from 'axios';
import Title from '../../components/styles/Title';
import Meta from '../../components/Meta';
import styled from 'styled-components';
import Link from 'next/link';
import LinkPrimary from '../../components/styles/LinkPrimary';

const ItemList = styled.li`
  /* background-color: #ececec; */
  padding: 1.2rem 3rem;

  font-size: 1.8rem;

  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.primaryBlack};
  margin-bottom: 1.2rem;
  font-weight: 400;
  border-bottom: 2px solid ${(props) => props.theme.primaryLight};
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 5rem;
`;

const Strong = styled.span`
  font-weight: 700;
`;

const Detail = styled.span``;

export default function Item({ item }) {
  console.log(item);
  return (
    <>
      <Meta />
      <main>
        <Title>{item.name}</Title>
        <Link href="/">
          <LinkPrimary>Edit</LinkPrimary>
        </Link>
        <Grid>
          <ItemList>
            <Strong>Tên sản phẩm </Strong>
            <Detail>{item.name}</Detail>
          </ItemList>
          <ItemList>
            <Strong>Giá 1 item </Strong>
            <Detail>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.pricePerItem)}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Số lượng </Strong>
            <Detail>{item.quantity}</Detail>
          </ItemList>
          <ItemList>
            <Strong>Tình trạng </Strong>
            <Detail>{item.status}</Detail>
          </ItemList>
          <ItemList>
            <Strong>Thuế </Strong>
            <Detail>
              {new Intl.NumberFormat('de-DE', {
                style: 'percent',
                maximumFractionDigits: 2,
              }).format(item.tax['$numberDecimal'] * 100)}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Thuế tính cho khách </Strong>
            <Detail>
              {new Intl.NumberFormat('de-DE', {
                stype: 'percent',
                maximumFractionDigits: 2,
              }).format(item.taxForCustomer['$numberDecimal'] * 100)}{' '}
              %
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Phí ship nội bộ Mỹ </Strong>
            <Detail>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.usShippingFee['$numberDecimal'])}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Cân nặng ước lượng </Strong>
            <Detail>
              {parseFloat(item.estimatedWeight['$numberDecimal'])}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Chi phí thực </Strong>
            <Detail>
              {new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'VND',
              }).format(item.actualCost['$numberDecimal'])}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Website order </Strong>
            <Detail>{item.orderedWebsite}</Detail>
          </ItemList>
          <ItemList>
            <Strong>Ngày tạo </Strong>
            <Detail>
              {new Date(item.createdAt).toLocaleString('en-us', {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              })}
            </Detail>
          </ItemList>
          <ItemList>
            <Strong>Link item </Strong>
            <Detail>{item.link.slice(0, 20)}...</Detail>
          </ItemList>
          <ItemList>
            <Strong>Tracking link </Strong>
            <Detail>{item.trackingLink.slice(0, 20)}...</Detail>
          </ItemList>

          <ItemList>
            <Strong>Account order </Strong>
            <Detail>{item.orderAccount.id}</Detail>
          </ItemList>
          <ItemList>
            <Strong>Ghi chú </Strong>
            <Detail>{item.notes}</Detail>
          </ItemList>
        </Grid>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  console.log(context.query.id);
  const res = await axios.get(
    `http://localhost:4444/api/v1/items/${context.params.id}`
  );
  console.log(res.data.data);

  return {
    props: { item: res.data.data.data },
  };
}
