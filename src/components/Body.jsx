import React from 'react'
import { Outlet } from 'react-router'

import NavBar from './NavBar'
import Footer from './Footer'

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer /> 
    </div>
  )
}
    
export default Body