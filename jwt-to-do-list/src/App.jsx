import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoList from "./components/TodoList";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import "./button.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToDOList: {},
      correctLogin: false,
      viewSignUp: true,
      nameValue: "",
      PassValue: "",
      requireNewName: false,
      requireNewPass: false,
      requireUserPass: "",
      requireUserName: "",
      updated: false,
      userName: "",
      userList: [],
      deleted: false,
      thingToDOVal: "",
      badToken: false,
      hasAccount: false,
    };
  }

  /* 
  ========================
  = SIGN-UP
  ========================
  = 1. Connect to database and send username, password.
  = 2. Server will respond by creating a jwt token, token is also stored in localStorage.
  */
  addUser = (e) => {
    if (this.state.nameValue && this.state.PassValue) {
      //Add new user to db
      fetch("/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: this.state.nameValue,
          userPass: this.state.PassValue,
        }),
        //handle errors
      })
        .then((res) => res.json())
        .then((response) => {
          localStorage.setItem(this.state.nameValue, `${response.userToken}`);
          alert(
            `Account created successfully🥳 You can now Login`
          );
          this.setState({
            userToDOList: response,
            hasAccount: false,
          });
        })
        .catch((error) => console.alert("Error:", error));
    } else {
      alert("Please enter a Name and Password");
    }
    //After creating new account, user will be returned to login.
    //Clear all the data and prepare for login.
    this.setState(
      {
        hasAccount: false,
        userToDOList: {},
        nameValue: "",
        PassValue: "",
        correctLogin: false,
        requireNewName: false,
        requireNewPass: false,
        requireUserPass: "",
        requireUserName: "",
        updated: false,
        userName: "",
        userList: [],
        deleted: false,
        thingToDOVal: "",
        userPassInputValue: "",
        userNameInputValue: "",
      },
      () => {}
    );
  }; //end of sign-up function

  /* 
  ========================
  = LOG-IN
  ========================
  = 1. On log-in, verify userName & passWrd on server and get that from mongoDB.
  = 2. Also retrieve JWT token and store in localStorage
  */
  logIn = (e) => {
    //Find user data in db
    fetch("/logIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: this.state.userNameInputValue,
        userPass: this.state.userPassInputValue,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        //store token to localStorage
        localStorage.setItem(
          this.state.userNameInputValue,
          `${response[0].userToken}`
        );

        this.setState({
          userList: response[0].toDoList,
          userName: response[0].userName,
          hasAccount: true,
          correctLogin: true,
        });
      })
      //Handle errors here
      .catch((error) => {
        if (error) {
          this.setState({
            hasAccount: false,
            correctLogin: false,
            errorMessage: "User not found",
          });
          console.alert(error);
        }
      });
  }; //end of Log-In function

    /* 
  ========================
  = LOG-OUT
  ========================
  = 1. The logout button will clear all inputs and set value to default
  */
  logOut = (e) => {
    this.setState({
      hasAccount: false,
      userToDOList: {},
      nameValue: "",
      PassValue: "",
      requireUserPass: "",
      requireUserName: "",
      userName: "",
      userPassInputValue: "",
      userNameInputValue: "",
      correctLogin: false,
    });
  };

    /* 
  ========================
  = INPUT LISTENERS
  ========================
  */
  //New Username Input
  newNameInput = (e) => {
    this.setState({
      requireNewName: e.target.required,
      nameValue: e.target.value,
    });
  };
  //New UserPwd Input
  newPassInput = (e) => {
    this.setState({
      requireNewPass: e.target.required,
      PassValue: e.target.value,
    });
  };
  //UserName input
  userNameInput = (e) => {
    this.setState(
      {
        requireUserName: e.target.required,
        userNameInputValue: e.target.value,
      });
  };
  //userPass input
  userPassInput = (e) => {
    this.setState({
      requireUserPass: e.target.required,
      userPassInputValue: e.target.value,
    });
  };
  //thing to do list Input
  thingToDOInput = (e) => {
    this.setState({
      thingToDOVal: e.target.value,
    });
  };

  /* 
  ========================
  = ADD TO LIST
  ========================
  = 1. ADD New Item to LIST
  = 2. When making updates, check JWT token to see if still the same user.
  */
  addToList = (e) => {
    this.setState(
      {
        userToDOList: [],
        localList: this.state.thingToDOVal,
      },
      () => {
        //UPDATE Button inside itemMenuUI
        //This update the selected item with new values
        fetch("/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem(
              this.state.userName
            )}`,
          },
          body: JSON.stringify({
            userName: this.state.userName, //look for this name in db
            toDoList: this.state.thingToDOVal, //add item to array
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            //catch any errors in response
            if (!response.err) {
              this.setState({
                userList: response.data[0].toDoList,
              });
            } else {
              alert(response.err);
            }
          });
      }
    );
  };

  /* 
  ========================
  = DELETE LIST ITEM
  ========================
  = 1. DELETE item from list
  = 2. User JWT token to authenticate user on the backend. if pass, server will respond to request
  */
  deleteItem = (e) => {
    this.setState(
      {
        toDoItem: e.target.dataset.listitem,
      },
      () => {
        fetch("/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem(
              this.state.userName
            )}`,
          },
          body: JSON.stringify({
            userName: this.state.userName,
            toDoList: this.state.toDoItem,
          }),
          //handle errors
        })
          .then((res) => res.json())
          .then((response) => {
            //catch any errors in response
            if (!response.err) {
              this.setState(
                {
                  deleted: !this.state.deleted,
                },
                () => {
                  this.setState({
                    userList: response.data[0].toDoList,
                  });
                }
              );
            } else {
              alert(response.err);
            }
          })
          .catch((error) => console.alert("Error:", error));
      }
    );
  };

    /* 
  ========================
  = RENDER
  ========================
  */
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <section className="App-section">
            <div className="try-testUser">
              <p>Create an account to log in</p>
              <p>OR login in with existing users</p>
              <ul>
                <li>Use (User name: password)</li>
                <li>user1 : 1</li>
                <li>user2 : 2</li>
              </ul>
            </div>

            <Routes>
              <Route
                index
                path="/"
                element={
                  <LogIn
                    logIn={this.logIn.bind(this)}
                    userNameInput={this.userNameInput.bind(this)}
                    userNameInputValue={this.state.userNameInputValue}
                    userPassInput={this.userPassInput.bind(this)}
                    userPassInputValue={this.state.userPassInputValue}
                  />
                }
              />

              <Route
                path="/SignUp"
                element={
                  <SignUp
                    hasAccount={this.state.hasAccount}
                    addUser={this.addUser.bind(this)}
                    newNameInput={this.newNameInput.bind(this)}
                    nameValue={this.state.nameValue}
                    newPassInput={this.newPassInput.bind(this)}
                    PassValue={this.state.PassValue}
                  />
                }
              />

              {/*
               *** The user must have an account to view the ToDoList Component.
               *** This component wont be accessible in the url(it is protected).
               */}

              <Route
                path="/TodoList"
                element={
                  <TodoList
                    errorMessage={this.state.errorMessage}
                    hasAccount={this.state.hasAccount}
                    userList={this.state.userList}
                    userName={this.state.userName}
                    thingToDOInput={this.thingToDOInput.bind(this)}
                    thingToDOVal={this.state.thingToDOVal}
                    addToList={this.addToList.bind(this)}
                    deleteItem={this.deleteItem.bind(this)}
                    logOut={this.logOut.bind(this)}
                  />
                }
              />
            </Routes>
            <div className="log-in-message">
              {/*
               *** Display successful message from server when logged in.
              */}
              {this.state.correctLogin ? (
                <p>Welcome back {this.state.userName}!</p>
              ) : (
                <></>
              )}
            </div>
          </section>
        </div>
      </BrowserRouter>
    );
  }
}
