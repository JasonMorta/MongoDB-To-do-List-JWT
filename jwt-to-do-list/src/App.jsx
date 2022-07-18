import React from "react";
import { useState, createContext } from "react";
import { BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoList from "./pages/TodoList";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

//create context hook
//This hook allow any nested children to share and alter data without the use of props.
export const StateContext = createContext();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toDoList, setToDoList] = useState([]);
  const [logInFail, setLogInFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    //These value will be passed to all children and updated from there.
    <StateContext.Provider
      value={[
        loggedIn,
        setLoggedIn,
        toDoList,
        setToDoList,
        logInFail,
        setLogInFail,
        loading,
        setLoading,
        data,
        setData,
      ]}
    >
      <div className="App">
        <section className="App-section">
          <Switch>
            
            <Route path="/SignUp">
              <SignUp />
            </Route>
            <Route path="/TodoList">
              <TodoList />
            </Route>

            <Route path="/">
              <LogIn />
            </Route>
          </Switch>
        </section>
      </div>
    </StateContext.Provider>
  );
}
