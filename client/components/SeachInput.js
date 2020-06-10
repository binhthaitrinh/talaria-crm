import React from 'react';
import styled from 'styled-components';

const SearchForm = styled.div`
  height: 100%;
  border-left: 1px solid ${(props) => props.theme.primaryLight};
  padding-left: 5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 60rem;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

const Form = styled.form`
  font-size: 1.6rem;
  display: flex;
  width: 100%;

  ion-icon {
    margin-right: 1rem;
  }
`;

const SearchInput = (props) => {
  return (
    <SearchForm>
      <Form>
        <ion-icon name="search-outline"></ion-icon>
        <Input type="text" placeholder="Search..." />
      </Form>
    </SearchForm>
  );
};

export default SearchInput;
