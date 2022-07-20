import React from "react";
import { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import { StateContext } from "../../App";
import Button from "react-bootstrap/Button";
import Spinner from "../loader/Spinner";



//Add item to List component
export default function AddItem() {
  const state = useContext(StateContext);

  //Destructuring shared state value
  //These values can now be read and modified here.
  let [, , , setToDoList, , , , , data, ,] = state;

  //save new item to state.
  //this state will replace the existing input field with a dummy when adding items to list.
  //This dummy will then be removed and the original input field will  be placed. this is done to clear the input.
  const [addNew, setAddNew] = useState(false);

  //this value will be sent to server
  const [thingToDOVal, setThingToDOVal] = useState("");

  //Get the default input value
  function newItemText(e) {
    setThingToDOVal(e.target.value);
  }

  //ADD ITEM
  async function addToList(e) {
    setAddNew(true);
    await fetch("/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionStorage.getItem(data.data[0].userName)}`,
      },
      body: JSON.stringify({
        toDoList: thingToDOVal,
      }),
      //handle errors
    })
      .then((res) => res.json())
      .then((response) => {
        setToDoList(response.data[0].toDoList); //return new list
        setAddNew(false); //remove the Spinner
        setThingToDOVal(""); //empty the input field
      })
      .catch((error) => {
        setAddNew(false);
        alert(error)
      });
  }

  return (
    <>
      {addNew ? (
        <Form.Control 
        value=" "
        />
      ) : (
        <Form.Control
          placeholder="Add to list"
          aria-label="Add Item"
          aria-describedby="basic-addon2"
          onInput={newItemText}
          defaultValue={thingToDOVal}
        />
      )}
      <Button
        onClick={addToList}
        variant="outline-secondary"
        id="button-addon2"
      >
        {addNew ? <Spinner /> : "ADD"}
      </Button>
    </>
  );
}
