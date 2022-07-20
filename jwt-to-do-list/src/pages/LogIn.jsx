import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { StateContext } from "../App";
import './styles/log-in.css'
import Alert from 'react-bootstrap/Alert';
import Loading from "../components/loader/Loading";

export default function LogIn(props) {
  //Parent state
  const state = useContext(StateContext);
  let navigate = useNavigate()

  //Destructuring shared state value
  let [,setLoggedIn , , setToDoList, , setLogInFail,loading, setLoading, data, setData] = state;

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
          setLoggedIn(true)
          setToDoList(response.data[0].toDoList);
          setData(response);//user data including token
          sessionStorage.setItem(userName, `${response.token}`);
         //show loading animation for 1sec
          setTimeout(() => {
            navigate('/TodoList')
            setLoading(false);
          }, 1000);
          
        })
        //Handle errors here
        .catch((error) => {
          if (error) {
            setTimeout(() => {
            setData(error);
            setToDoList([]);
            setLogInFail(true);
            navigate('*')
          }, 1000);
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

  //clear state values on log-up page
    useEffect(() => {
      setToDoList([])
      setData([])
      getUser()
      setLoggedIn(false)
      setLoading(false)
      setLogInFail(false)
      navigate('/')
    },[])
   
 

  return (
<>
      { loading ? <Loading /> : <div className="logIn-container">
        {showUsers ? <Alert variant="success">
        <Alert.Heading>Test users</Alert.Heading>
        <hr />
        <ul style={{paddingLeft: "19px"}}>
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
      </div>}
</>
  );
}
