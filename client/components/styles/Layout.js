import styled from 'styled-components';

const Layout = styled.div`
  height: 95vh;
  width: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.primaryBlack};
  background-color: ${(props) => props.theme.offWhite};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 10px;
  box-shadow: 2px 8px 24px -4px rgba(0, 0, 0, 0.4);
  font-weight: 300;
`;

export default Layout;
