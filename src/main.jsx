import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginPage from "./pages/auth/loginPage.jsx";
import RegisterPage from "./pages/auth/registerPage.jsx";
import AuthRoute from "./pages/auth/authRoute.jsx"
import Meetings from "./pages/meetings/Meetings.jsx";
import Tasks from "./pages/tasks/Tasks.jsx";
import Reminders from "./pages/reminders/Reminders.jsx";
import HomePage from "./pages/home/homePage.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Emails from "./pages/emails/Emails";
import EmailDetails from "./pages/emails/EmailDetails";
import { auth } from "./components/firebaseConfig.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <Routes>
              <Route path="/" element={<AuthRoute><App/></AuthRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />}/>
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/email/" element={<EmailDetails />} />
          </Routes>
      </Router>
  </StrictMode>,
)
