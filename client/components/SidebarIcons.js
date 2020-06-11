import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SidebarIconStyle from './styles/SidebarIconStyle';
import MenuList from './styles/MenuList';
import MenuItem from './styles/MenuItem';

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

const SidebarIcons = (props) => {
  const router = useRouter();
  console.log(router);
  return (
    <SidebarIconStyle>
      <MenuList>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            className={
              router.pathname.split('/')[1] === item.pathname ? 'active' : ''
            }
          >
            <Link href={`/${item.pathname}`}>
              <a>
                <ion-icon name={item.icon}></ion-icon>
                <span>{item.item}</span>
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
