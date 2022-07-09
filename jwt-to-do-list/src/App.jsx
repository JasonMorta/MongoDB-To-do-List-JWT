import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import TodoList from "./components/TodoList";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import "./button.css"


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToDOList:{},
      correctLogin: "",
      viewSignUp: true,
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
      badToken: false,
      hasAccount: false,
   
    };
  }

  //SIGN-UP Button
  addUser = (e) => {
      if ( this.state.nameValue && this.state.PassValue ) {
      

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
        .then((response) =>{
            localStorage.setItem(this.state.nameValue, `${response.userToken}`)
            alert(`Welcome ${response.userName}! You can now Login`)
            this.setState({
                userToDOList: response,
                hasAccount: false,
            });
        })
        .catch((error) => console.log("Error:", error));

      } else {
        alert("Please enter a Name and Password");
    


    };


  }//end of sign-up function

  
  //LOG-IN
  //On log-in store JWT token to localStorage
  logIn=(e)=>{
        //Find user data in db
         fetch('/findUser', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "authorization":  `Bearer ${localStorage.getItem(this.state.userNameInputValue)}`
           },
          body: JSON.stringify({
            userName: this.state.userNameInputValue,
          }),
        })
        .then((res) => res.json())
        .then((response) =>{
              console.log(response)

              this.setState({
                userName: response.data[0].userName,
                userList: response.data[0].toDoList,
                hasAccount: true,
                correctLogin: true,
                logInSuccess: response.msg
              });
        })

         //Handle errors here
         .catch((error) => {
            if(error){
              this.setState({
                hasAccount: false,
                correctLogin: false,
                errorMessage: " Authentication Failed" 
              })
            }
           
        })
  }//end of Log-In function


  //LOG-OUT button
  logOut = (e) => {
    this.setState({
      hasAccount: false,
      userToDOList:{},
      nameValue: "",
      PassValue: "",
      correctLogin: false,
      requireNewName: false,
      requireNewPass: false,
      requireUserPass: '',
      requireUserName: '',
      updated: false,
      userName: "",
      userList:[],
      deleted: false, 
      thingToDOVal: "",
      userPassInputValue: "",
      userNameInputValue:"",
    
    },()=>{
    });
    
  };





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
    console.log(e.target.value)
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
      headers: { 
        "Content-Type": "application/json",
        "authorization":  `Bearer ${localStorage.getItem(this.state.userName)}`
     },
      body: JSON.stringify({
        userName: this.state.userName,//look for this name in db
        toDoList: this.state.thingToDOVal,//add item to array
      })

    })
    .then((res) => res.json())
    .then(( response) =>{
    console.log(response)
     
      //catch any errors in response
      if(!response.err){
     this.setState({
      userList:response.data[0].toDoList
      })
      }else{
        alert(response.err)
      }
   
      })
      
   })


    
  }

  //DELETE item from list
  //User JWT token to authenticate user on the backend. if pass, server will respond to request
  deleteItem=(e)=>{

this.setState({
  toDoItem:e.target.dataset.listitem,
  
},()=>{
      fetch("/remove", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json", 
        "authorization": `Bearer ${localStorage.getItem(this.state.userName)}`
      },
      body: JSON.stringify({
        userName: this.state.userName,
        toDoList: this.state.toDoItem,
      
      }),
      //handle errors
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response)
         

     
          //catch any errors in response
          if(!response.err){
            this.setState({
              deleted: !this.state.deleted,
             },()=>{
               this.setState({
                 userList:response.data[0].toDoList
               })
             })
          }else{
            alert(response.err)
          }
  
      })
      .catch((error) => console.log("Error:", error));
  console.log(this.state.toDoItem)
})

      
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        
        <section className="App-section">
        <p className="try-testUser">
          Create an account to log in
        </p>
        
        <Routes>

        <Route  index  path="/" element={<LogIn 
                logIn={this.logIn.bind(this)}
                userNameInput={this.userNameInput.bind(this)}
                userNameInputValue={this.state.userNameInputValue}
                userPassInput={this.userPassInput.bind(this)}
                userPassInputValue={this.state.userPassInputValue}/>
          }/>


        <Route path="/SignUp" element={ 
            <SignUp
              hasAccount={this.state.hasAccount}
              addUser={this.addUser.bind(this)}
              newNameInput={this.newNameInput.bind(this)}
              nameValue={this.state.nameValue}
              newPassInput={this.newPassInput.bind(this)}
              PassValue={this.state.PassValue}/>
          }/>
    

  {/* 
  *** The user must have an account to view the ToDoList Component.
  *** This component wont be accessible in the url(it is protected).
  */}
         
            <Route  path="/TodoList"  element={ 
              <TodoList 
                errorMessage={this.state.errorMessage}
                hasAccount={this.state.hasAccount}
                userList={this.state.userList}
                userName={this.state.userName}
                thingToDOInput={this.thingToDOInput.bind(this)}
                thingToDOVal={this.state.thingToDOVal}
                addToList={this.addToList.bind(this)}
                deleteItem={this.deleteItem.bind(this)}
                logOut={this.logOut.bind(this)} />
              }/>
       
   

        </Routes>
        <div className="log-in-message">

          {/*
          *** Display successful message from server when logged in.
          */}
          {this.state.correctLogin ? 
          <p>{this.state.logInSuccess}</p>
          : <></>}

        </div>
        </section>
       
      </div>
      </BrowserRouter>
    );
  }
}
