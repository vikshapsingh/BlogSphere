import React from 'react'
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import { Outlet } from 'react-router-dom'
import {ClerkProvider} from '@clerk/clerk-react'
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function Rootlayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <div className=' text-justify'>
        <Header/>
          <div style={{minHeight:"90vh"}}>
               <Outlet/>
          </div>
        <Footer/>  
    </div>
    </ClerkProvider>
  )
}

export default Rootlayout