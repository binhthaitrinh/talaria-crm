import styled from 'styled-components';

const MenuItem = styled.li`
  background-color: transparent;
  color: ${(props) => props.theme.primaryLight};
  padding: 1.6rem 2.4rem;
  font-size: 1.6rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border-left: 8px solid transparent;

  a {
    color: ${(props) => props.theme.primaryLight};
    font-weight: 700;
  }

  i {
    margin-right: 2rem;
  }

  &:hover {
    background-color: ${(props) => props.theme.primaryLight};
    color: ${(props) => props.theme.primaryDark};
    border-left: 8px solid ${(props) => props.theme.primaryDark};

    a {
      color: ${(props) => props.theme.primaryDark};
    }
  }

  &.active {
    background-color: ${(props) => props.theme.primaryLight};
    color: ${(props) => props.theme.primaryDark};
    border-left: 8px solid ${(props) => props.theme.primaryDark};

    a {
      color: ${(props) => props.theme.primaryDark};
    }
  }
`;

export default MenuItem;
