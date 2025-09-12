import React from 'react'
import { Navigate } from 'react-router-dom'
import { getValidToken } from '../api/authApi.js'

const ProtectedRoute = ({children}) => {
    const token = getValidToken();
    if(!token){
        return <Navigate to="/login" replace />
    }
  return children;
}

export default ProtectedRoute
