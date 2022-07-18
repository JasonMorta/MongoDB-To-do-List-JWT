import React from "react";
import { useContext } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { StateContext } from "../App";
import './styles/log-in.css'

export default function LogIn(props) {
  //Parent state
  const state = useContext(StateContext);

  //Destructuring shared state value
  let [, , , setToDoList, , setLogInFail, , setLoading, , setData] = state;

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

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

  /* 
 ====================================================
 Log-in will return a new token.
 The token will then be checked every time us user 
 makes an update or the to-do-list
 ===================================================
 */

  //LOG-IN
  async function logIn(e) {
    if (validate) {
      setLoading(true);
      //Find user data in db
      await fetch("/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          userPass: password,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          setToDoList(response[0].toDoList);
          setData(response);
          localStorage.setItem(userName, `${response[0].userToken}`);
          setLoading(false);
        })
        //Handle errors here
        .catch((error) => {
          if (error) {
            setData(error);
            setToDoList([]);
            setLogInFail(true);
          }
        });
    } else {
      alert("Please enter a Name and Password");
    }
  } //end of Log-In function

  return (
    <div className="logIn-container">
      <h2 style={{ color: "white", marginBottom: "1.25rem" }}>Log-In</h2>
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

      <div className="My-btn-link">
        <Link
          to={validate ? "/TodoList" : "/"}
          
          className="My-btn"
          onClick={logIn}
        >
          LOG-IN
        </Link>

        <Link
          to="/SignUp"
          className="btn-Link"
          variant="outline-secondary"
          id="button-addon2"
        >
          <button className="My-btn">Create Account</button>
        </Link>
      </div>
    </div>
  );
}
