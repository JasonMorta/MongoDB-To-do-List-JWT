import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function SignUp(props) {
  //This component will create a user Account
  return (
    <div className=" sign-up-container">
      <h2 style={{ color: "white", marginBottom: "1.25rem" }}>Sign-Up</h2>
      <InputGroup className="mb-3">
        <Form.Control
          required={true}
          placeholder="User name"
          onInput={props.newNameInput}
          aria-describedby="basic-addon2"
          defaultValue={props.nameValue}
        />
      </InputGroup>
      <InputGroup className="mb-3 password">
        <Form.Control
          required={true}
          onInput={props.newPassInput}
          placeholder="Password"
          aria-describedby="basic-addon2"
          defaultValue={props.PassValue}
        />
      </InputGroup>
      <Link
        to={props.hasAccount ? "/TodoList" : "/"}
        onClick={props.addUser}
        disabled
      >
        <button className="My-btn">CREATE ACCOUNT</button>
      </Link>
      <br />

      <Link className="btn-Link" to="/" id="button-addon2">
        <button className="My-btn">◃ Back </button>
      </Link>
    </div>
  );
}
