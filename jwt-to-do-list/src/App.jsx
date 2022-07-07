import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoList from "./components/TodoList";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signUp: true, //if true, display sign-up window
      toDoWin: false,
      logIn: false,
      nameValue: "",
      PassValue: "",
      requireNewName: false,
      requireNewPass: false,
      requireUserPass: '',
      requireUserName: '',
      userToDOList:[],
    };
  }

  //SIGN-UP Button
  addUser = (e) => {
    // if (!this.state.requireNewPass || !this.state.requireNewName) {
    //   alert("Please enter a User name and Password");
    // } else {
    //   //save password to sessionStorage
    //   sessionStorage.newUserP = this.state.PassValue;
    //   sessionStorage.newUserN = this.state.nameValue;
    //   // alert("welcome "+sessionStorage.newUserN)
    //   this.setState({
    //     signUp: false, //if true, display sign-up window
    //     toDoWin: true,
    //     logIn: false,
    //   });

    // }

console.log( this.state.nameValue)
    fetch('/createUser', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: "newUser",
      }),
      //handle errors
    })
      // .then((res) => res.json())
      // .then((response) =>{}
      
      //   // this.setState(
      //   //   {
      //   //     userToDOList: response,
      //   //   })
      // )
      // .catch((error) => console.log("Error:", error));
  };

  //LOG-IN
  logIn=(e)=>{
    if (
      this.state.userNameInputValue === 
      sessionStorage.newUserN && 
      this.state.userPassInputValue ===
      sessionStorage.newUserP) {
        this.setState({
          toDoWin: true,
          logIn: false,
          signUp: false,
          userPassInputValue: "",
          userNameInputValue: "",
    
        });






    } else{
      alert("Please enter corrent unername & password")
  
  }
  }


  //LOG-OUT button
  logOut = (e) => {
    this.setState({
      toDoWin: false,
      logIn: true,
      signUp: false,
      nameValue: '',
      PassValue: '',
    },()=>{
    });
    
  };

  //CREATE USER button
  createAcc = (e) => {
    sessionStorage.clear();
    this.setState({
      logIn: false,
      signUp: true,
      toDoWin: false,
    });
  };

  //Switch to LOG-IN screen button
  switchToLI=(e)=>{
    this.setState({
      logIn: true,
      signUp: false,
      toDoWin: false,
    });
  }

  //New Username Input
  newNameInput = (e) => {
    console.log(e);
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
  userNameInput=(e)=>{
    console.log(e.target.value)
    this.setState({
      requireUserName: e.target.required,
      userNameInputValue: e.target.value,

    });
    console.log(this.state.userNameInputValue)
  }

  //userPass input
  userPassInput=(e)=>{
   
    this.setState({
      requireUserPass: e.target.required,
      userPassInputValue: e.target.value,
    });
    console.log(this.state.userPassInputValue)
  }

  render() {
    return (
      <div className="App">
        <section className="App-section">
          {this.state.signUp ? (
            <SignUp
            switchToLI={this.switchToLI.bind(this)}
              addUser={this.addUser.bind(this)}
              newNameInput={this.newNameInput.bind(this)}
              nameValue={this.state.nameValue}
              newPassInput={this.newPassInput.bind(this)}
              PassValue={this.state.PassValue}
            />
          ) : (
            <></>
          )}

          {this.state.toDoWin ? (
            <TodoList logOut={this.logOut.bind(this)} />
          ) : (
            <></>
          )}

          {this.state.logIn ? (
            <LogIn 
              logIn={this.logIn.bind(this)}
              userNameInput={this.userNameInput.bind(this)}
              userNameInputValue={this.state.userNameInputValue}
              userPassInput={this.userPassInput.bind(this)}
              userPassInputValue={this.state.userPassInputValue}
              createAcc={this.createAcc.bind(this)} />
          ) : (
            <></>
          )}
        </section>
      </div>
    );
  }
}
