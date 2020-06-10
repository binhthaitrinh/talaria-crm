import styled from 'styled-components';

const SidebarIconStyle = styled.div`
  width: 30rem;
  height: 100%;
  background-color: ${(props) => props.theme.primary};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SidebarIconStyle;
