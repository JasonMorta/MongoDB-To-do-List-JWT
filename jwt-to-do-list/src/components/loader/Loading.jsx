import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../../App";
import "../../button.css";
import './style.css'

export default function Loading() {
  //This is the loading screen that will display after log-in is clicked
  //If the log-in fails, display a log-in failed screen.

  const state = useContext(StateContext);

  //Destructuring shared state value
  let [, , , ,logInFail,setLogInFail , , , , ,] = state;
   
  return (
    <div >
     
         <p className="loading-text">loading...</p>
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
    
    </div>
  );
}
