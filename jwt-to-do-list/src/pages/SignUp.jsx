import React, { useContext } from "react";
import { 
  Link , 
  useNavigate,
  use,
  useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import './styles/sign-up.css'
import { StateContext } from "../App";
import Loading from "../components/loader/Loading";
import { useEffect } from "react";




  /* 
  ========================
  1.  This component will create a user Account.
  2. When a user sign's up, two functions will run.
    - the first function will create a new document for the user on MDB,
    - the second function will be triggered inside the first function to log-in the user also. this
    function will find the user document in the DB and and create a new JWT token for this user. JWT 
    token will be created every time a user log's in and stored in sessionStorage.
  ========================

  */
export default function SignUp(props) {
  
  //navigate to home pahe if account created successuffly
  let navigate = useNavigate();

  //Parent state
  const state = useContext(StateContext)

  //Destructuring shared state value
  let [,setLoggedIn,,setToDoList,,setLogInFail,loading,setLoading,,setData] = state;

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [nameTaken, setNameTaken] = useState(false);

  //Prevent user from navigating to the todolist if not logged in
  useEffect(() => {
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

  //* LOG-IN after account created
  //This logIn will follow the same process as the log-in component.
  async function logIn(e) {
    setLoading(true);
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
        sessionStorage.setItem(userName, `${response.token}`);
        setData(response);
        setTimeout(() => {
          navigate('/TodoList')
          setLoading(false);
        }, 1300);
       })
      //Handle errors here
      .catch((error) => {
        if (error) {
          setData(error);
          setToDoList([]);
          setLoading(false);
          setLogInFail(true);
         
        }
      });
  } //end of Log-In fun


  /* 
  ========================
  =//* SIGN-UP
  ========================
  = 1. Connect to database and send username, password.
  = 2. Server will respond by creating a jwt token, token is also stored in sessionStorage.
  */
  async function addUser(e) {
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
        .then(( response) => {
          if (response === "Username taken") {
            setNameTaken(true);
          } else {
            setLoading(true);
            setNameTaken(false)
            logIn()
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
   <>
      {loading? <Loading /> : <div className=" sign-up-container">
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
          <button 
            onClick={addUser}
            className="My-btn">CREATE ACCOUNT
          </button>
        <br />
  
        <Link className="btn-Link" to="/" id="button-addon2">
          <button className="My-btn">◃ Back </button>
        </Link>
        {nameTaken ? (
          <p className="userName sign-up-page">User name already taken</p>
        ) : (
          <></>
        )}
      </div>}
   </>
  );
}
