import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
      if ( !this.state.requireNewName) {
        alert("Please enter a User name and Password");
      } else {
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
        .then((response) =>{
          localStorage.setItem("token", "Bearer " + response.userToken)
          this.setState({
              userToDOList: response,
            },()=>{

            })}
        )
        .catch((error) => console.log("Error:", error));
    };

      //after Sign-Up log-in
            //Find user data in db
            fetch('/findUser', {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "authorization":  `${localStorage.getItem("token")}`
               },
              body: JSON.stringify({
                userName: this.state.requireNewName,
              }),
              //handle errors
            })
              .then((res) => res.json())
              .then((response) =>{
               
                console.log(response)
                // if(!response.err){
                //   console.log(response)
                  
                //   this.setState({
                //     loggedIn: true,
                //     userName: response.data[0].userName,
                //     userList:response.data[0].toDoList,
                //       },()=>{
                //       })
                   
                //    }else{
                //      alert(response.err)
                //    }
                
                }
              )
              .catch((error) => console.log("Error:", error));


  }

  
  //LOG-IN
  //On log-in store JWT token to localStorage
  logIn=(e)=>{
    console.log("username: " + this.state.userNameInputValue)
    if (
      this.state.userNameInputValue && 
      this.state.userPassInputValue) {
        //Find user data in db
         fetch('/findUser', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "authorization":  `${localStorage.getItem("token")}`
           },
          body: JSON.stringify({
            userName: this.state.userNameInputValue,
          }),
          //handle errors
        })
          .then((res) => res.json())
          .then((response) =>{
           
            if(!response.err){
              console.log(response)
              
              this.setState({
                loggedIn: true,
                userName: response.data[0].userName,
                userList:response.data[0].toDoList,
                  },()=>{
                  })
               
               }else{
                 alert(response.err)
               }
            
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
      userPassInputValue: "",
      userNameInputValue:"",
    
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
      headers: { 
        "Content-Type": "application/json",
        "authorization":  `${localStorage.getItem("token")}`
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
        "authorization":  localStorage.getItem("token")
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
        <Routes>

        <Route index  path="/" element={
           
          <LogIn 
              logIn={this.logIn.bind(this)}
              userNameInput={this.userNameInput.bind(this)}
              userNameInputValue={this.state.userNameInputValue}
              userPassInput={this.userPassInput.bind(this)}
              userPassInputValue={this.state.userPassInputValue}
              createAcc={this.createAcc.bind(this)}/>
          
            }/>

        <Route    path="/SignUp" element={ 
            <SignUp
            switchToLI={this.switchToLI.bind(this)}
              addUser={this.addUser.bind(this)}
              newNameInput={this.newNameInput.bind(this)}
              nameValue={this.state.nameValue}
              newPassInput={this.newPassInput.bind(this)}
              PassValue={this.state.PassValue}/>
          }/>
       
          
          <Route  path="/TodoList"  element={ 
            
            <TodoList 
            userList={this.state.userList}
            userName={this.state.userName}
              thingToDOInput={this.thingToDOInput.bind(this)}
              thingToDOVal={this.state.thingToDOVal}
              addToList={this.addToList.bind(this)}
              deleteItem={this.deleteItem.bind(this)}
              logOut={this.logOut.bind(this)} />
             
            }/>

         
            
            
            </Routes>
        </section>
      </div>
      </BrowserRouter>
    );
  }
}
