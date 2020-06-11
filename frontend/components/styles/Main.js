import styled from 'styled-components';

const Main = styled.div`
  background-color: ${(props) => props.theme.primaryLight};
  grid-area: main;
  border-bottom-right-radius: 8px;
  overflow-y: auto;
`;

export default Main;
