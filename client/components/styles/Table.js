import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  /* border: 1px solid ${(props) => props.theme.offWhite}; */
  table-layout: fixed;
  
    font-size: 1.2rem;
  
  thead {
    td, th {
      font-weight: 700;
    }
  }

  td,
  th {
    /* border-bottom: 1px solid ${(props) => props.theme.primaryLight}; */
    /* border-right: 1px solid ${(props) => props.theme.offWhite}; */
    position: relative;
    padding: 1.2rem 0.6rem;
    font-weight: 300;
    &:last-child {
      border-right: none;
      width: 150px;
      position: relative;
      
    }
    label {
      padding: 10px 5px;
      display: block;
    }

    :first-child {
       width: 10rem;
    }
  }

`;

export default Table;
