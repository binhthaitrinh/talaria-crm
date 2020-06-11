import React from 'react';
import HeaderStyle from './styles/HeaderStyle';
import styled from 'styled-components';
import SearchInput from './SeachInput';

const Logo = styled.img`
  height: 4.8rem;
  border-radius: 5px;
  margin-left: 2rem;
`;

const LogoBox = styled.div`
  width: 28rem;
`;

const Header = (props) => {
  return (
    <HeaderStyle>
      <LogoBox>
        <Logo src="/talaria-logo.jpg" />
      </LogoBox>

      <SearchInput />
    </HeaderStyle>
  );
};

export default Header;
