import styled from 'styled-components';

const MenuItem = styled.li`
  background-color: transparent;
  color: ${(props) => props.theme.primaryDark};
  padding: 1.6rem 2.4rem;
  font-size: 1.6rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border-right: 8px solid transparent;

  a {
    font-weight: 700;
    display: flex;
    align-items: center;
    line-height: 1;
  }

  ion-icon {
    margin-right: 2rem;
    font-size: 1.8rem;
  }

  &:hover {
    background-color: ${(props) => props.theme.primaryLight};
    color: ${(props) => props.theme.primaryDark};
    border-right: 8px solid ${(props) => props.theme.primaryDark};
  }

  &.active {
    background-color: ${(props) => props.theme.primaryLight};
    color: ${(props) => props.theme.primaryDark};
    border-right: 8px solid ${(props) => props.theme.primaryDark};
  }
`;

export default MenuItem;
