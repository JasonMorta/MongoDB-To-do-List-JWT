import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StateContext } from "../App";
import './styles/log-in.css'
import Alert from 'react-bootstrap/Alert';

export default function LogIn(props) {
  //Parent state
  const state = useContext(StateContext);

  let location = useLocation();
  let navigate = useNavigate()


  //Destructuring shared state value
  let [loggedIn, setLoggedIn, , setToDoList, , setLogInFail, , setLoading, , setData] = state;

  const [userName,    setUserName   ] = useState("");
  const [password,    setPassword   ] = useState("");
  const [showUsers,   setShowUsers  ] = useState(false);
  const [users,       setUsers      ] = useState([])
  const [nameAndPass, setNameAndPass] = useState(false)
  
    //Load users from DB on page load
    useEffect(() => {
      getUser()
        setToDoList([]);
        setLoggedIn(false)
    },[])

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
    setLogInFail(true);
    if (validate) {
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
          setLoggedIn(true)
          setLogInFail(false)
          setTimeout(() => {
            navigate('/TodoList')
            setLogInFail(false);
          }, 1000);
          setToDoList(response[0].toDoList);//todolist only
          setData(response);//user data including token
          sessionStorage.setItem(userName, `${response[0].userToken}`);
        })
        //Handle errors here
        .catch((error) => {
          setLogInFail(true);
          setData(error);
          setLoggedIn(false)
          setToDoList([]);
          alert("User not found")
          });

    } else {
      setLogInFail(false);
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
      console.log(response)
    })
    .catch((error) => {
      setShowUsers(false)
      console.log(error)
    })
  }


    
 

  return (
    <div className="logIn-container">
      {showUsers ? <Alert variant="success">
      <Alert.Heading>Test users</Alert.Heading>
      <hr />
      <ul>
        {users.map(user=>(
          <li key={user.userName}>{user.userName} : {user.userPass}</li>
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
        
          
         <button className="My-btn" onClick={logIn}>
            LOG-IN
         </button>
     

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
