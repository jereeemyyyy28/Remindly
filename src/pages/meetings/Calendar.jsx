// import { useState, useEffect } from 'react';
// import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
// import {
//   createViewDay,
//   createViewWeek,
//   createViewMonthGrid,
//   createViewMonthAgenda,
// } from '@schedule-x/calendar';
// import { createEventsServicePlugin } from '@schedule-x/events-service';

// import '@schedule-x/theme-default/dist/index.css';

// import CustomDateGridEvent from "./CustomDateGridEvent";

// function CalendarApp() {
//   const [eventsService] = useState(() => createEventsServicePlugin());
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     start: '',
//     end: '',
//   });

//   const calendar = useCalendarApp({
//     views: [
//       createViewDay(),
//       createViewWeek(),
//       createViewMonthGrid(),
//       createViewMonthAgenda(),
//     ],
//     events: [],
//     plugins: [eventsService],
//   });

//   useEffect(() => {
//     // Fetch all events
//     eventsService.getAll();
//   }, [eventsService]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent((prevEvent) => ({
//       ...prevEvent,
//       [name]: value,
//     }));
//   };


// const handleAddEvent = (e) => {
//     e.preventDefault();
//     if (newEvent.title && newEvent.start && newEvent.end) {
//       eventsService.add({
//         title: newEvent.title,
//         start: new Date(newEvent.start).toISOString(),
//         end: new Date(newEvent.end).toISOString(),
//       });
//       setNewEvent({ title: '', start: '', end: '' });
//     } else {
//       alert('Please fill in all fields.');
//     }
//   };

  

//   return (
//     <div>
//       <form onSubmit={handleAddEvent}>
//         <input
//           type="text"
//           name="title"
//           value={newEvent.title}
//           onChange={handleInputChange}
//           placeholder="Event Title"
//           required
//         />
//         <input
//           type="datetime-local"
//           name="start"
//           value={newEvent.start}
//           onChange={handleInputChange}
//           placeholder="Start Time"
//           required
//         />
//         <input
//           type="datetime-local"
//           name="end"
//           value={newEvent.end}
//           onChange={handleInputChange}
//           placeholder="End Time"
//           required
//         />
//         <button type="submit">Add Event</button>
//       </form>
//       <div className="sx-react-calendar-wrapper">
//         <ScheduleXCalendar calendarApp={calendar} 
//         customComponents={{
//             //timeGridEvent: CustomTimeGridEvent,
//             dateGridEvent: CustomDateGridEvent,
//           }}
//         />
//       </div>
//     </div>
//   );
// }

//export default CalendarApp;

// import { db } from "../../components/firebaseConfig.js";
// import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore'; // Make sure Firestore functions are imported
// import { useState, useEffect } from 'react';
// import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
// import {
//   createViewDay,
//   createViewMonthAgenda,
//   createViewMonthGrid,
//   createViewWeek,
// } from '@schedule-x/calendar'
// import { createEventsServicePlugin } from '@schedule-x/events-service'

// import '@schedule-x/theme-default/dist/index.css'

// import { format } from 'date-fns';

// import { getAuth } from "firebase/auth";

// function formatDate(date) {
//   return format(new Date(date), 'yyyy-MM-dd HH:mm');
// }


// function CalendarApp() {
    
//     const auth = getAuth();
//     const currentUser = auth.currentUser;

//   const eventsService = useState(() => createEventsServicePlugin())[0]
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     start: '',
//     end: '',
//   });
  
//   const calendar = useCalendarApp({
//     views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
//     events: [
//       {
//         id: '1',
//         title: 'TEST',
//         start: '2025-01-16',
//         end: '2025-01-16',
//       },
//     ],
//     plugins: [eventsService]
//   })

//   useEffect(() => {
//     // get all events
//     eventsService.getAll()
//   }, [])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent((prevEvent) => ({
//       ...prevEvent,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     if (!currentUser) return;

//     // Fetch events from Firestore for the current user
//     const unsubscribe = onSnapshot(
//       collection(db, `Meetings/${currentUser.uid}/UserMeetings`), // Replace 'events' with the correct Firestore collection
//       (snapshot) => {
//         const eventsData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         //setEvents(eventsData); // Set events state
//         eventsService.set(eventsData); // Update events in the calendar
//       },
//       (error) => {
//         console.error("Error fetching events:", error);
//       }
//     );

//     // Cleanup the listener when component unmounts
//     return () => unsubscribe();
//   }, [currentUser]);

// // const handleAddEvent = (e) => {
// //     e.preventDefault();
// //     if (newEvent.title && newEvent.start && newEvent.end) {
// //       const formattedStart = formatDate(newEvent.start);
// //       const formattedEnd = formatDate(newEvent.end);
  
// //       console.log('Adding event:', formattedStart, formattedEnd);
// //       eventsService.add({
// //         title: newEvent.title,
// //         start: formattedStart,
// //         end: formattedEnd,
// //       });
// //       setNewEvent({ title: '', start: '', end: '' });

      
// //     } else {
// //       alert('Please fill in all fields.');
// //     }
// //   };

// const handleAddEvent = async (e) => {
//     e.preventDefault();
//     if (newEvent.title && newEvent.start && newEvent.end) {
//       const formattedStart = formatDate(newEvent.start);
//       const formattedEnd = formatDate(newEvent.end);
  
//       console.log('Adding event:', formattedStart, formattedEnd);
  
//       // Add event data to Firestore
//       try {
//         await addDoc(collection(db, `Meetings/${currentUser.uid}/UserMeetings`), {
//           title: newEvent.title,
//           start: formattedStart,
//           end: formattedEnd,
//         });
        
//         console.log('Event added to Firestore');
        
//         // Clear the form
//         setNewEvent({ title: '', start: '', end: '' });
//       } catch (error) {
//         console.error('Error adding event to Firestore:', error);
//       }
  
//       //If you have eventsService to manage the UI or event list:
//       eventsService.add({
//         title: newEvent.title,
//         start: formattedStart,
//         end: formattedEnd,
//       });
  
//     } else {
//       alert('Please fill in all fields.');
//     }
//   };
  

//   return (
//     <div>
//       <form onSubmit={handleAddEvent}>
//         <input
//           type="text"
//           name="title"
//           value={newEvent.title}
//           onChange={handleInputChange}
//           placeholder="Event Title"
//           required
//         />
//         <input
//           type="datetime-local"
//           name="start"
//           value={newEvent.start}
//           onChange={handleInputChange}
//           placeholder="Start Time"
//           required
//         />
//         <input
//           type="datetime-local"
//           name="end"
//           value={newEvent.end}
//           onChange={handleInputChange}
//           placeholder="End Time"
//           required
//         />
//         <button type="submit">Add Event</button>
//       </form>
//       <ScheduleXCalendar calendarApp={calendar} />
//     </div>
    
//   )
// }

// export default CalendarApp


import { db } from "../../components/firebaseConfig.js";
import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { getAuth } from "firebase/auth";
import '@schedule-x/theme-default/dist/index.css';
import { format } from 'date-fns';

function formatDate(date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

function CalendarApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  // Initialize the events service
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
  });

  // Calendar setup
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [],
    plugins: [eventsService],
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Clean up the listener
  }, [auth]);

  // Fetch events when currentUser is available
  useEffect(() => {
    if (!currentUser) return; // Don't fetch if there's no user

    // Fetch events from Firestore for the current user
    const unsubscribe = onSnapshot(
      collection(db, `Meetings/${currentUser.uid}/UserMeetings`),
      (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        eventsService.set(eventsData); // Update events in the calendar
      },
      (error) => {
        console.error("Error fetching events:", error);
      }
    );

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.start && newEvent.end) {
      const formattedStart = formatDate(newEvent.start);
      const formattedEnd = formatDate(newEvent.end);

      console.log('Adding event:', formattedStart, formattedEnd);

      // Add event data to Firestore
      try {
        await addDoc(collection(db, `Meetings/${currentUser.uid}/UserMeetings`), {
          title: newEvent.title,
          start: formattedStart,
          end: formattedEnd,
        });

        console.log('Event added to Firestore');

        // Clear the form
        setNewEvent({ title: '', start: '', end: '' });
      } catch (error) {
        console.error('Error adding event to Firestore:', error);
      }

      //If you have eventsService to manage the UI or event list:
      eventsService.add({
        title: newEvent.title,
        start: formattedStart,
        end: formattedEnd,
      });

    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAddEvent}>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          required
        />
        <input
          type="datetime-local"
          name="start"
          value={newEvent.start}
          onChange={handleInputChange}
          placeholder="Start Time"
          required
        />
        <input
          type="datetime-local"
          name="end"
          value={newEvent.end}
          onChange={handleInputChange}
          placeholder="End Time"
          required
        />
        <button type="submit">Add Event</button>
      </form>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;




