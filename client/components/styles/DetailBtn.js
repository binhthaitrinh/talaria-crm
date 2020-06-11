import styled from 'styled-components';
import Button from './Button';

const DetailBtn = styled(Button)`
  width: 4rem;
  height: 4rem;
  padding: 1rem;
  background-color: transparent;

  :hover {
    background-color: ${(props) => props.theme.primaryLight};
  }
`;

export default DetailBtn;
