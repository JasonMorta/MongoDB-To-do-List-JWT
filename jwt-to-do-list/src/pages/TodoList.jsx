import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";

import InputGroup from "react-bootstrap/InputGroup";
import trash from "../img/trash.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StateContext } from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import "../button.css";
import { useState } from "react";
import Loading from "../components/loader/Loading";

import AddItem from "../components/addItemToList/AddItem";

//The ToDoList page will only handle the deleted items
//The add item will is handle in the AddItem component
export default function TodoList(props) {

  const state = useContext(StateContext)

  let navigate = useNavigate()

   //Destructuring shared state value
   //These values can now be read and modified here.
   let [,, toDoList, setToDoList,,, loading,, data,] = state
  
  //save new item to state.
  //this state will change to heading text when deleting an item
  const [removeItem, setRemoveItem]=useState(false)

    //Log user out when route changes
    useEffect(() => {
      console.log(data)
      if(data.data[0].toDoList.length === 0){
        navigate("/")
      }
    },[data])


  //DELETE Item
  //Delete an item from the List
  async function deleteItem(e){
    setRemoveItem(true)
    let toDoItem = e.target.dataset.listitem
    await fetch("/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionStorage.getItem(data.data[0].userName)}`,
      },
      body: JSON.stringify({
        toDoList: toDoItem,
      }),
      //handle errors
    })
      .then((res) => res.json())
      .then((response) => {
        setToDoList(response.data[0].toDoList);
        setRemoveItem(false)
      })
      .catch((error) =>{
         setRemoveItem(false)
         alert(error)
        });
  }


  
  return (

    (  
      loading ? 
      <Loading />:
      <div className="to-do-list-outer">
        <div className="to-do-container">
          <Card border="info" style={{ borderColor: "firebrick" }}>
            <Card.Header style={{ position: "relative" }}>
              {/* To clear the input I added a condition that will will remove and reinsert the element. */}
              {removeItem ? "Deleting...♻" :"TO DO LIST"}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <div className="user-list">
                  {toDoList.map((doc) => (
                    <div className="item-cont">
                      <p className="item-text">{doc}</p>
                      <img
                        src={trash}
                        alt="trash"
                        className="trash-icon"
                        data-listitem={doc}
                        onClick={deleteItem}
                      />
                    </div>
                  ))}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
          <br />
          <InputGroup className="mb-3">
           
            <AddItem />
            
          </InputGroup>
          <button className="My-btn" onClick={props.logOut} variant="dark">
            <Link to="/">Log Out</Link>
          </button>
          <p className="userName">{`User: ${data.data[0].userName}`}</p>
        </div>
     
       
     
      </div>
    )

  );
}
