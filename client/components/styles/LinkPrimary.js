import styled from 'styled-components';

const LinkPrimary = styled.a`
  &,
  &:link,
  &:visited {
    text-transform: uppercase;
    text-decoration: none;

    display: inline-block;
    border-radius: 10rem;
    transition: all 0.2s;
    position: relative;
    background-color: ${(props) => props.theme.primary};
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.8rem 1.6rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    background-color: ${(props) => props.theme.primaryDark};
  }

  &:active,
  &:focus {
    outline: none;
    transform: translateY(-1px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }
`;

export default LinkPrimary;
