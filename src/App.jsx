import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "antd"

function App() {

    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        console.log("Navigating to login page")
        navigate("/login");
    }

    const handleNavigateToRegister = () => {
        console.log("Navigating to register page");
        navigate("/register");
    }


  return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-800">
          <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-white font-bold text-2xl mb-4">Welcome to Remindly.</h1>
              <div className="flex flex-col space-y-2">
                  <Button onClick={handleNavigateToLogin}>Login Page</Button>
                  <Button onClick={handleNavigateToRegister}>Register Page</Button>
              </div>
          </div>
      </div>
  )
}

export default App
