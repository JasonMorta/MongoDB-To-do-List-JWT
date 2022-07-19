import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { StateContext } from "../App";
import './styles/log-in.css'
import Alert from 'react-bootstrap/Alert';

export default function LogIn(props) {
  //Parent state
  const state = useContext(StateContext);

  //Destructuring shared state value
  let [, , , setToDoList, , setLogInFail, , setLoading, , setData] = state;

  const [userName,    setUserName   ] = useState("");
  const [password,    setPassword   ] = useState("");
  const [showUsers,   setShowUsers  ] = useState(false);
  const [users,       setUsers      ] = useState([])
  const [nameAndPass, setNameAndPass] = useState(false)

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
          setToDoList(response[0].toDoList);//todolist only
          setData(response);//user data including token
          sessionStorage.setItem(userName, `${response[0].userToken}`);
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
      setNameAndPass(true)
      alert("Please enter a name and password")
    }
  } //end of Log-In function


  /* 
  ======================================
  Return all the username from MongoDb
  ======================================
  */
  async function getUser() {
    setShowUsers(true)
    await fetch("/findUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((response) => {
      setUsers(response)
    })
    .catch((error) => {
      setShowUsers(false)
      console.log(error)
    })
  }

  //Load users from DB on page load
    useEffect(() => {
      getUser()
    },[])
    
 

  return (
    <div className="logIn-container">
      {showUsers ? <Alert variant="success">
      <Alert.Heading>Test users</Alert.Heading>
      <hr />
      <ul style={{paddingLeft: "19px"}}>
        {users.map(user=>(
          <li  key={user.userName}>{user.userName} : {user.userPass}</li>
        ))}
      </ul>
    </Alert>:
    <></>}
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
