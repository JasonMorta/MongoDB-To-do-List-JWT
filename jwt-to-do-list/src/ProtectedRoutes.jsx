import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'



export default function ProtectedRoutes(props) {


   //The Outlet will be used to prevent a user from rendering the toDoList when clicking the sign-in button, unless they pass the requirements

   //Navigate will return user to logIn page


  return  (
    props.hasAccount ? <Outlet/>: <Navigate to="/"/>
  )



}
