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
      userToDOList:{},
      loggedIn: false,
      nameValue: "",
      PassValue: "",
      requireNewName: false,
      requireNewPass: false,
      requireUserPass: '',
      requireUserName: '',
      updated: false,
      userName: "",
      userList:[],
      deleted: false, 
      thingToDOVal: "",
   
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
          userPass: this.state.PassValue
        }),
        //handle errors
      })
        .then((res) => res.json())
        .then((response) =>
        
          this.setState({
              userToDOList: response,
            
            },()=>{
             
             console.log(response)
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
        //Find user data in db
         fetch('/findUser', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: this.state.userNameInputValue,
            userPass: this.state.userPassInputValue
          }),
          //handle errors
        })
          .then((res) => res.json())
          .then(( response) =>{
          
           this.setState({
            loggedIn: true,

            userName: response[0].userName,
            userList:response[0].toDoList,
              
              },()=>{
                console.log("Logged-IN")
                console.log("Username; " + this.state.userNameInputValue)
                console.log("Pass; " + this.state.userPassInputValue)
              })
           
            
            }
          )
          .catch((error) => console.log("Error:", error));

    } else{
      alert("Please enter correct username & password")
  
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
      userToDOList: [],
    
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
    })
  }

  //ADD New Item to LIST
  addToList=(e)=>{
   this.setState({
    userToDOList: [],
    localList:this.state.thingToDOVal,
   },()=>{
         //UPDATE Button inside itemMenuUI
    //This update the selected item with new values
    fetch("/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: this.state.userNameInputValue,
        toDoList: this.state.thingToDOVal,
      })

    })
    .then((res) => res.json())
    .then(( response) =>{
     this.setState({
      userList:response.toDoList,
  
      })
      console.log("Added "+this.state.userList)

      })
    .catch((error) => console.log("Error:", error));
   })


    
  }

  //DELETE item from list
  deleteItem=(e)=>{

this.setState({
  toDoItem:e.target.dataset.listitem,
  
},()=>{
      fetch("/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: this.state.userName,
        toDoList: this.state.toDoItem,
      
      }),
      //handle errors
    })
      .then((res) => res.json())
      .then((response) =>(
          this.setState({
           deleted: !this.state.deleted,
          },()=>{
            this.setState({
              userList:response.toDoList
            })
            console.log(this.state.userList)
          })
  
      ))
      .catch((error) => console.log("Error:", error));
  console.log(this.state.toDoItem)
})


      
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
            userList={this.state.userList}
            userName={this.state.userName}
              thingToDOInput={this.thingToDOInput.bind(this)}
              thingToDOVal={this.state.thingToDOVal}
              addToList={this.addToList.bind(this)}
              deleteItem={this.deleteItem.bind(this)}
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
