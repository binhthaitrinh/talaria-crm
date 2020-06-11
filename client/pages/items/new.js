import React, { useState } from 'react';
import axios from 'axios';
import Title from '../../components/styles/Title';
import styled from 'styled-components';

const Form = styled.form``;

const FormGroup = styled.div`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const Input = styled.input`
  font-size: 1.5rem;
  font-family: inherit;
  color: inherit;
  padding: 1.5rem 2rem;
  border-radius: 2px;
  background-color: ${(props) => props.theme.primaryLight};
  border: none;
  border-bottom: 5px solid transparent;
  display: block;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:focus {
    border-bottom: 5px solid ${(props) => props.theme.primary};
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
    outline: none;
  }

  &:focus:invalid {
    border-bottom: 5px solid red;
  }
`;

const Label = styled.label`
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
  transition: all 0.3s;
`;

const PageBody = styled.div`
  margin-top: 3rem;
`;

export default function CreateItem(props) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [pricePerItem, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderAccount, setOrderAccount] = useState('');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };

  const submitForm = async (obj) => {
    try {
      console.log(obj);
      const res = await axios.post(
        'http://localhost:4444/api/v1/items',
        obj,
        config
      );

      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <Title>Create a new Item</Title>
      <PageBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(name);
            submitForm({ pricePerItem, link });
          }}
        >
          <FormGroup>
            <Label htmlFor="name">Product name</Label>
            <Input
              type="text"
              placeholder="Enter product name..."
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="name">Product Link</Label>
            <Input
              type="text"
              placeholder="Enter product link..."
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pricePerItem">Price per item</Label>
            <Input
              type="text"
              placeholder="Enter price..."
              id="pricePerItem"
              value={pricePerItem}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="tax">Tax</Label>
            <Input type="text" placeholder="Enter tax..." id="tax" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pricePerItem">Enter tax to charge customer</Label>
            <Input
              type="text"
              placeholder="Enter price..."
              id="taxForCustomer"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="usShippingFee">usShippingFee</Label>
            <Input
              type="text"
              placeholder="Enter price..."
              id="usShippingFee"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="quantity">quantity</Label>
            <Input type="text" placeholder="Enter price..." id="quantity" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="estimatedWeight">Estimated weight</Label>
            <Input
              type="text"
              placeholder="Enter price..."
              id="estimatedWeight"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="orderedWebsite">order Website</Label>
            <Input
              type="text"
              placeholder="Enter price..."
              id="orderedWebsite"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="orderAccount">orderAccount</Label>
            <Input type="text" placeholder="Enter price..." id="orderAccount" />
          </FormGroup>

          <button>Submit</button>
        </Form>
      </PageBody>
    </>
  );
}
