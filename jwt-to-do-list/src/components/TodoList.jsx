import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function TodoList(props) {
  return (
    <div className='to-do-container'>      
      <Card border="info" style={{ borderColor: "firebrick" }}>
    <Card.Header style={{position: "relative"}}>MY TO DO LIST 
    
    </Card.Header>
    <Card.Body>
      <Card.Title>Things to do</Card.Title>
      <Card.Text>
        <div className='user-list'>

        </div>
      </Card.Text>
    </Card.Body>
  </Card>
  <br/>
  <InputGroup className="mb-3">
        <Form.Control
          placeholder="Add to list"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <Button variant="outline-secondary" id="button-addon2">
          ADD
        </Button>
        
      </InputGroup>
      <Button 
      onClick={props.logOut}
      variant="danger" 
      className='logOut-btn'>Log Out</Button>
  </div>
  )
}
