import React from "react";
import { 
  Link , 
  Redirect,
  useHistory,
  useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import './styles/sign-up.css'

export default function SignUp(props) {
  //This component will create a user Account

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [nameTaken, setNameTaken] = useState(false);

  //Send userName to state
  function userNameInput(e) {
    setUserName(e.target.value);
  }

  //Send password tpt state
  function userPass(e) {
    setPassword(e.target.value);
  }

  //User must enter a name and password
  let validate = userName && password;
  let history = useHistory();//This hook is used to redirect the page to the log-in when creating an account successfully
  /* 
  ========================
  = SIGN-UP
  ========================
  = 1. Connect to database and send username, password.
  = 2. Server will respond by creating a jwt token, token is also stored in localStorage.
  */
  async function addUser(e) {
    setNameTaken(false);
    if (validate) {
      //Add new user to db
      await fetch("/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName,
          userPass: password,
        }),
        //handle errors
      })
        .then((res) => res.json())
        .then((response) => {
          if (response === "Username taken") {
            
            console.log(response)
            setNameTaken(true);
          } else {
            
           
            
            
            setTimeout(() => {
              history.push("/")
            }, 3000);
            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please enter a Name and Password");
    }
    
  } //end of sign-up function

  return (
    <div className=" sign-up-container">
      <h2 style={{ color: "white", marginBottom: "1.25rem" }}>Sign-Up</h2>
      <InputGroup className="mb-3">
        <Form.Control
          required={true}
          placeholder="User name"
          onInput={userNameInput}
          aria-describedby="basic-addon2"
          defaultValue={userName}
        />
      </InputGroup>
      <InputGroup className="mb-3 password">
        <Form.Control
          required={true}
          onInput={userPass}
          placeholder="Password"
          aria-describedby="basic-addon2"
          defaultValue={password}
        />
      </InputGroup>
      <Link onClick={addUser} to="/SignUp">
        <button className="My-btn">CREATE ACCOUNT</button>
      </Link>
      <br />

      <Link className="btn-Link" to="/" id="button-addon2">
        <button className="My-btn">◃ Back </button>
      </Link>
      {nameTaken ? <p className="userName sign-up-page">User name already taken</p>: <></>}
    </div>
  );
}
