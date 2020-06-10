import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SidebarIconStyle from './styles/SidebarIconStyle';
import MenuList from './styles/MenuList';
import MenuItem from './styles/MenuItem';

const menuItems = [
  {
    pathname: '/',
    item: 'Dashboard',
    icon: 'fas fa-columns',
  },
  {
    pathname: '/items',
    item: 'Items',
    icon: 'fas fa-columns',
  },
  {
    pathname: '/customers',
    item: 'Customers',
    icon: 'fas fa-user-friends',
  },
  {
    pathname: '/affiliates',
    item: 'Affiliates',
    icon: 'fab fa-sellsy',
  },
  {
    pathname: '/giftcards',
    item: 'Gift cards',
    icon: 'fas fa-gift',
  },
  {
    pathname: '/paxful',
    item: 'Paxful',
    icon: 'fab fa-bitcoin',
  },
  {
    pathname: '/transactions',
    item: 'Transactions',
    icon: 'fab fa-cc-mastercard',
  },
  {
    pathname: '/bills',
    item: 'Bills',
    icon: 'fas fa-money-bill',
  },
];

const SidebarIcons = (props) => {
  const router = useRouter();
  console.log(router);
  return (
    <SidebarIconStyle>
      <MenuList>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            className={router.pathname === item.pathname ? 'active' : ''}
          >
            <Link href={item.pathname}>
              <a>
                <i className={item.icon}></i>
                {item.item}
              </a>
            </Link>
          </MenuItem>
        ))}

        {/* <MenuItem className="active">
          <Link href="/">
            <a>
              <i class=""></i>Items
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Bills
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Customers
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Affiliate
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Gift Card
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Paxful
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">
            <a>
              <i class=""></i>Transaction
            </a>
          </Link>
        </MenuItem> */}
      </MenuList>
    </SidebarIconStyle>
  );
};

export default SidebarIcons;
