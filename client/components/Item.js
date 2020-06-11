import React, { useState } from 'react';
import DetailBtn from './styles/DetailBtn';
import styled from 'styled-components';
import Link from 'next/link';

const Detail = styled.div`
  background-color: #fff;
  box-shadow: 2px 2px 18px -2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-95%, 15%);
  padding: 0.6rem 0rem;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  li {
    width: 15rem;
    cursor: pointer;
    border-left: 4px solid transparent;
    display: flex;

    a {
      width: 100%;
      height: 100%;
      padding: 1rem 0rem 1rem 1.8rem;
    }
  }

  li:hover {
    background-color: ${(props) => props.theme.primaryLight};
    border-left: 4px solid ${(props) => props.theme.primaryDark};
  }
`;

const Item = ({ item, index }) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <tr
      key={item.id}
      onClick={() => setShowDetail(false)}
      style={{ backgroundColor: index % 2 === 0 ? '#ececec' : '#fff' }}
    >
      <th>
        {new Date(item.createdAt).toLocaleString('en-us', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        })}
      </th>
      <th>
        <a href={item.trackingLink}>{item.trackingLink.slice(0, 20)}...</a>
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
      <th>{item.status}</th>
      <th>
        <DetailBtn
          onClick={(e) => {
            e.stopPropagation();
            setShowDetail(!showDetail);
          }}
        >
          ...
        </DetailBtn>
        <Detail className={showDetail ? 'show' : ''}>
          <ul>
            <li>
              <Link href={`/items/${item.id}`}>
                <a>View</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Edit</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Delete</a>
              </Link>
            </li>
          </ul>
        </Detail>
      </th>
    </tr>
  );
};

export default Item;
