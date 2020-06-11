import React from 'react';
import HeaderStyle from './styles/Header';

const menuItems = [
  {
    pathname: '',
    item: 'Dashboard',
    icon: 'analytics-outline',
  },
  {
    pathname: 'items',
    item: 'Items',
    icon: 'pricetags-outline',
  },
  {
    pathname: 'customers',
    item: 'Customers',
    icon: 'people-outline',
  },
  {
    pathname: 'affiliates',
    item: 'Affiliates',
    icon: 'git-network-outline',
  },
  {
    pathname: 'giftcards',
    item: 'Gift cards',
    icon: 'gift-outline',
  },
  {
    pathname: 'paxful',
    item: 'Paxful',
    icon: 'logo-bitcoin',
  },
  {
    pathname: 'transactions',
    item: 'Transactions',
    icon: 'card-outline',
  },
  {
    pathname: 'bills',
    item: 'Bills',
    icon: 'cash-outline',
  },
];

function Header(props) {
  return <HeaderStyle />;
}

export default Header;
