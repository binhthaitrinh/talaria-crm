import styled from 'styled-components';

const Layout = styled.div`
  height: 100vh;
  color: ${(props) => props.theme.black};
  background-color: ${(props) => props.theme.offWhite};
  display: flex;
  position: relative;
`;

export default Layout;
