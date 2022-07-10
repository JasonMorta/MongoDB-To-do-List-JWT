import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import trash from "../img/trash.png";
import { Link } from "react-router-dom";

export default function TodoList(props) {
 let style;
 function css() {
  style = {
    transition: ".4s",
    opacity: 1
   }
  }




  return (

    <div className="to-do-list-outer">
      {props.hasAccount ? 
      <div  className={props.hasAccount? "to-do-container": "to-do-container fade"}>
        <Card border="info" style={{ borderColor: "firebrick" }}>
          <Card.Header style={{ position: "relative" }}>
            TO DO LIST
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <div className="user-list">
                {props.userList.map((doc) => (
                  <div className="item-cont">
                    <p className="item-text">{doc}</p>
                    <img
                      src={trash}
                      alt="trash"
                      className="trash-icon"
                      data-listitem={doc}
                      onClick={props.deleteItem}
                    />
                  </div>
                ))}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Add to list"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            onInput={props.thingToDOInput}
            defaultValue={props.thingToDOVal}
          />
          <Button
            onClick={props.addToList}
            variant="outline-secondary"
            id="button-addon2"
          >ADD
          </Button>
          
        </InputGroup>
        <button className="My-btn"  onClick={props.logOut} variant="dark">
          <Link to="/">Log Out</Link>
        </button>
      </div>
      :
      <div className="to-do-container no-data">
      <h2>Sorry no data found</h2>
      <h2>{props.errorMessage}</h2>
      <button  className="My-btn" onClick={props.logOut} variant="dark">
        <Link to="/" >Back</Link>
      </button>
      </div> }

      </div>  
      );
    
}
