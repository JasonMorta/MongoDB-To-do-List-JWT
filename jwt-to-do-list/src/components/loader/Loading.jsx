import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../../App";
import "../../button.css";

export default function Loading() {
  //This is the loading screen that will display after log-in is clicked
  //If the log-in fails, display a log-in failed screen.

  const state = useContext(StateContext);

  //Destructuring shared state value
  let [, , , , logInFail, , , , , ,] = state;

  return (
    <div>
      {logInFail ? (
        <div>
          <p>Incorrect username or password, return to log-in</p>

          <div class="btn-cont">
            <Link to="/">
              <button class="My-btn"> ↩ Back</button>
            </Link>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
