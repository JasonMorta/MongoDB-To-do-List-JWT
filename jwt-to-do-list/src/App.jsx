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
      // signUp: true, //if true, display sign-up window
      // toDoWin: false,
      // logIn: false,
      loggedIn: false,
      nameValue: "",
      PassValue: "",
      requireNewName: false,
      requireNewPass: false,
      requireUserPass: '',
      requireUserName: '',
      userToDOList:[],
      thingToDOVal: "",
      updatedToDOList:[],
    };
  }

  //SIGN-UP Button
  addUser = (e) => {
      if (!this.state.requireNewPass || !this.state.requireNewName) {
        alert("Please enter a User name and Password");
      } else {
        //save password to sessionStorage
        sessionStorage.newUserP = this.state.PassValue;
        sessionStorage.newUserN = this.state.nameValue;
        // alert("welcome "+sessionStorage.newUserN)
        this.setState({
          signUp: false, //if true, display sign-up window
          toDoWin: true,
          logIn: false,
        });

        //Add new user to db
      fetch('/createUser', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: this.state.nameValue,
        }),
        //handle errors
      })
        .then((res) => res.json())
        .then((response) =>
        
          this.setState({
              userToDOList: response,
              updatedToDOList:response.toDoList,
            },()=>{
              console.log(this.state.userToDOList)
              alert("Signed-UP")
            })
        )
        .catch((error) => console.log("Error:", error));
       
    };


  }

  //LOG-IN
  logIn=(e)=>{
    if (
      this.state.userNameInputValue === 
      sessionStorage.newUserN && 
      this.state.userPassInputValue ===
      sessionStorage.newUserP) {
      this.setState({
          loggedIn: true,
          userToDOList: [],
    
        });

        //Find user data in db
         fetch('/findUser', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: this.state.userNameInputValue,
          }),
          //handle errors
        })
          .then((res) => res.json())
          .then(( response) =>
          
           this.setState({
                userToDOList: response,
                updatedToDOList:response.toDoList,
              },()=>{
                console.log(this.state.userToDOList)
                alert("Logged-IN")
              })
          )
          .catch((error) => console.log("Error:", error));

    } else{
      alert("Please enter corrent unername & password")
  
  }
  }


  //LOG-OUT button
  logOut = (e) => {
    this.setState({
      loggedIn: false,
      nameValue: '',
      PassValue: '',
      userPassInputValue: "",
      userNameInputValue: "",
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
    
    this.setState({
      requireUserName: e.target.required,
      userNameInputValue: e.target.value,

    },()=>{
      console.log(this.state.userNameInputValue)
    });
   
  }

  //userPass input
  userPassInput=(e)=>{
   
    this.setState({
      requireUserPass: e.target.required,
      userPassInputValue: e.target.value,
    });
    console.log(this.state.userPassInputValue)
  }

//thing to do list Input
  thingToDOInput=(e)=>{
    this.setState({
      thingToDOVal: e.target.value,
    },()=>{
      console.log(this.state.thingToDOVal)
    })
  }

  //Add New Item to LIST
  addToList=(e)=>{
    console.log(this.state.userNameInputValue)
     //UPDATE Button inside itemMenuUI
    //This update the selected item with new values
    fetch("/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: this.state.userNameInputValue,
        toDoList: this.state.thingToDO,
       
      }),
      //handle errors
    })
      .then((res) => res.json())
      .then((response) =>
    
      
      this.setState({
        updatedToDOList: response.toDoList,
      },()=>{
        
        alert("Logged-IN")
      })
      )
      .catch((error) => console.log("Error:", error));
  }

  render() {
    return (
      <div className="App">
        <section className="App-section">
          
            <SignUp
            switchToLI={this.switchToLI.bind(this)}
              addUser={this.addUser.bind(this)}
              newNameInput={this.newNameInput.bind(this)}
              nameValue={this.state.nameValue}
              newPassInput={this.newPassInput.bind(this)}
              PassValue={this.state.PassValue}
            />
       

         
            <TodoList 
              updatedToDOList={this.state.updatedToDOList}
              thingToDOInput={this.thingToDOInput.bind(this)}
              thingToDOVal={this.state.thingToDOVal}
              addToList={this.addToList.bind(this)}
              userToDOList={this.state.userToDOList}
              logOut={this.logOut.bind(this)} />
         

         
            <LogIn 
              logIn={this.logIn.bind(this)}
              userNameInput={this.userNameInput.bind(this)}
              userNameInputValue={this.state.userNameInputValue}
              userPassInput={this.userPassInput.bind(this)}
              userPassInputValue={this.state.userPassInputValue}
              createAcc={this.createAcc.bind(this)} />
          
        </section>
      </div>
    );
  }
}
