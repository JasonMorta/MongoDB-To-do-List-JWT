import React from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { StateContext } from "../App";
import { useState } from "react";
import { useContext } from "react";

export default function SignUp(props) {
  //This component will create a user Account


  const state = useContext(StateContext)


  //Destructuring shared state value
  let [loggedIn, setLoggedIn, toDoList, setToDoList, logInFail, setLogInFail, loading, setLoading, data, setData] = state

  const [userName, setUserName]=useState("")
  const [password, setPassword]=useState("")
   const  [nameTaken, setNameTaken]= useState(false)
   const [created, setCreated]=useState("/")

    //Send userName to state
    function userNameInput(e){
      setUserName(e.target.value)
    }
  
    //Send password tpt state
    function userPass(e){
      setPassword(e.target.value)
    }

    //User must enter a name and password
    let validate = userName && password

    /* 
  ========================
  = SIGN-UP
  ========================
  = 1. Connect to database and send username, password.
  = 2. Server will respond by creating a jwt token, token is also stored in localStorage.
  */
  async function addUser(e){
    setNameTaken(false)
    if (validate) {
      //Add new user to db
    await  fetch("/createUser", {
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
          if  (response === "Username taken"){
            setNameTaken(true)
            setCreated("/SignUp")
          }else{
            alert("Account created")
          }
 
        })
        .catch((error) => {
          console.log(error)
        });
    } else {
      alert("Please enter a Name and Password");
    }
    

  }; //end of sign-up function


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
      <Link
        to={created}
        onClick={addUser}
        disabled>
        <button className="My-btn">CREATE ACCOUNT</button>
      </Link>
      <br />

      <Link className="btn-Link" to="/" id="button-addon2">
        <button className="My-btn">◃ Back </button>
      </Link>
    </div>
  );
}
