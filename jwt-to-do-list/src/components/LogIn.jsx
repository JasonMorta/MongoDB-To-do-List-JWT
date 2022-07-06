import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function LogIn() {
  return (
    <div className="logIn-container">
      <br />
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="User name"
          
          aria-describedby="basic-addon2"
        />
      </InputGroup>
      <InputGroup className="mb-3 password" >
        <Form.Control
          placeholder="Password"
          
          aria-describedby="basic-addon2"
        />
      </InputGroup>

      <Button variant="outline-secondary" id="button-addon2">
        Log in
      </Button>
    </div>
  );
}
