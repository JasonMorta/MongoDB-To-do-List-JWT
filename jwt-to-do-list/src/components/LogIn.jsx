import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function LogIn(props) {
  return (
    <div className="logIn-container">
      <h2 style={{color: "white", marginBottom: "1.25rem"}}>Log-In</h2>
      <InputGroup className="mb-3">
        <Form.Control
        required="true"
          placeholder="User name"
          onInput={props.userNameInput}
          aria-describedby="basic-addon2"
          defaultValue={props.userNameInputValue}
        />
      </InputGroup>
      <InputGroup className="mb-3 password" >
        <Form.Control
        required="true"
          onInput={props.userPassInput}
          placeholder="Password"
          aria-describedby="basic-addon2"
          defaultValue={props.userPassInputValue}
        />
      </InputGroup>
      <Button 
        onClick={props.logIn}
        variant="outline-secondary" id="button-addon2">
        Log in
      </Button>
      <Button className="newUser" 
        onClick={props.createAcc}
        variant="outline-secondary" id="button-addon2">
        Create Account
      </Button>
    </div>
  );
}
