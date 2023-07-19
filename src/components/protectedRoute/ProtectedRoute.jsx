import React from "react"
import { Navigate } from "react-router-dom"
import Header from "../Header/Header"

const ProtectedRoute = ({element:Component,loggedIn, dataUser, ...props}) => {
    // console.log(dataUser)
    return (
               loggedIn ? 
               <>
               <Header 
               dataUser={dataUser} 
               />
               <Component {...props} /> 
               </>
               : <Navigate to={'/signin'} replace />
    )
    
}

export default ProtectedRoute;