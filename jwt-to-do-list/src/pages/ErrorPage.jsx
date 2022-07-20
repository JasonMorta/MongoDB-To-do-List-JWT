import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StateContext } from '../App';
import '../button.css'


export default function ErrorPage() {

  let location = useLocation()

  let state = useContext(StateContext)
  //Destructuring shared state value
  //These values can now be read and modified here.
  let [loggedIn,setLoggedIn,toDoList, setToDoList,logInFail,, loading,, data,setData] = state


  
  useEffect(() => {
    setLoggedIn(false)
  
  }, [location])
  
 



  return (
   <>
      {logInFail ? 
      
      <div style={{zIndex: 1,
          color: "#f44336",
          zIndex: 1}}>
          <p>Incorrect username or password, return to log-in</p>

          <div className="btn-cont">
            <Link to="/" className="My-btn">↩ Back
            </Link>
          </div>
        </div>
        
        :
        
        <div style={{color: "white"}}>
        <div style={{fontSize: "3.125rem"}}>ERROR! PAGE NOT FOUND</div>
          <p>Please log in</p>
           <Link className="btn-Link" to="/" id="button-addon2">
            <button className="My-btn">◃ Back to log-in </button>
          </Link>
      </div>}
   </>
  )
}
