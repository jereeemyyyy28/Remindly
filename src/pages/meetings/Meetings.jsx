// Meetings.jsx
import { useState } from 'react';
import NavBar from "../../components/navBar.jsx";
import CreateEvent from "./CreateEvent"; // Corrected path
import Calendar from "./Calendar"; // Import the Calendar component
import './Calendar.css';  // Import the Calendar component styles

const Meetings = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Sample Event',
      start: '2025-01-20 10:00',
      end: '2025-01-20 12:00',
    },
  ]);

  // Function to handle adding new events to the calendar
  const handleEventCreate = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      newEvent,
    ]);
  };

  return (
    <div className="p-6">
      <NavBar />
      <h1 className="text-3xl font-bold">Meetings</h1>
      <p>Welcome to the Meetings page!</p>
      
      {/* Integrate the Calendar component */}
      <Calendar events={events} />
      
      {/* Add some space between the components */}
      <div className="my-6"></div>  {/* Adjust the margin to create space */}
      
      {/* Integrate the CreateEvent component */}
      <CreateEvent onEventCreate={handleEventCreate} />
    </div>
  );
};

export default Meetings;









