import styled from 'styled-components';

const SidebarTextStyle = styled.div`
  background-color: ${(props) => props.theme.primaryLight};
  width: 30rem;
  height: 100%;
  transform: translateX(-30rem);
  transition: all 0.5s ease-out;
  position: absolute;
  z-index: 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  &.show {
    transform: translateX(0px);
    position: relative;
  }
`;

export default SidebarTextStyle;
