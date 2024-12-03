import React from 'react'
import ProtectRoute from '../ProtectRoute'

const Admin = () => {
  return (
    <ProtectRoute>
      <h1>Dashboard</h1>
      <p>Xodim nazorati tizimi</p>
    </ProtectRoute>
  )
}

export default Admin