// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation

// const UpcomingEvents = () => {
//     const [events, setEvents] = useState([
//         { id: 1, activity: 'Beach Cleanup', destination: 'Santa Monica Beach', date: '2024-11-15' },
//         { id: 2, activity: 'Hiking Trip', destination: 'Yosemite National Park', date: '2024-12-01' },
//     ]);

//     const handleEditEvent = (id) => {
//         const eventToEdit = events.find(event => event.id === id);
//         const updatedActivity = prompt('Edit Activity:', eventToEdit.activity);
//         const updatedDestination = prompt('Edit Destination:', eventToEdit.destination);
//         const updatedDate = prompt('Edit Date:', eventToEdit.date);

//         if (updatedActivity && updatedDestination && updatedDate) {
//             setEvents(events.map(event => 
//                 event.id === id 
//                     ? { ...event, activity: updatedActivity, destination: updatedDestination, date: updatedDate } 
//                     : event
//             ));
//         }
//     };

//     const handleDeleteEvent = (id) => {
//         setEvents(events.filter(event => event.id !== id));
//     };

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.title}>Upcoming Events</h1>
//             <Link to="/" style={styles.link}>Back to Wanderlist</Link> {/* Link back to the Wanderlist component */}
//             <ul style={styles.eventList}>
//                 {events.map(event => (
//                     <li key={event.id} style={styles.eventItem}>
//                         <span>{`${event.activity} (Dest: ${event.destination}, Date: ${event.date})`}</span>
//                         <div>
//                             <button onClick={() => handleEditEvent(event.id)} style={styles.actionButton}>✏️</button>
//                             <button onClick={() => handleDeleteEvent(event.id)} style={styles.actionButton}>🗑️</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };


// const styles = {
//     container: {
//         backgroundColor: 'white',
//         borderRadius: '12px',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
//         padding: '20px',
//         width: '400px',
//         textAlign: 'center',
//     },
//     title: {
//         fontSize: '1.8em',
//         marginBottom: '15px',
//         color: '#000',
//     },
//     eventList: {
//         listStyleType: 'none',
//         padding: '0',
//         marginTop: '10px',
//     },
//     eventItem: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '8px',
//         borderBottom: '1px solid #ccc',
//         fontSize: '0.9em',
//         transition: 'background-color 0.3s',
//     },
//     actionButton: {
//         background: 'transparent',
//         border: 'none',
//         color: '#4CAF50',
//         fontSize: '0.9em',
//         cursor: 'pointer',
//         marginLeft: '5px',
//         transition: 'color 0.3s',
//     },
//     link: {
//         display: 'block',
//         textAlign: 'center',
//         marginTop: '20px',
//         color: '#0b0c0b',
//         textDecoration: 'none',
//         fontSize: '1em',
//     },
// };

// export default UpcomingEvents;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([
        { id: 1, activity: 'Beach Cleanup', destination: 'Santa Monica Beach', date: '2024-11-15' },
        { id: 2, activity: 'Hiking Trip', destination: 'Yosemite National Park', date: '2024-12-01' },
    ]);

    const handleEditEvent = (id) => {
        const eventToEdit = events.find(event => event.id === id);
        const updatedActivity = prompt('Edit Activity:', eventToEdit.activity);
        const updatedDestination = prompt('Edit Destination:', eventToEdit.destination);
        const updatedDate = prompt('Edit Date:', eventToEdit.date);

        if (updatedActivity && updatedDestination && updatedDate) {
            setEvents(events.map(event => 
                event.id === id 
                    ? { ...event, activity: updatedActivity, destination: updatedDestination, date: updatedDate } 
                    : event
            ));
        }
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-4 text-black">Upcoming Events</h1>
            <Link to="/" className="block mb-4 text-blue-600 hover:text-blue-800 text-lg">
                Back to Wanderlist
            </Link>
            <ul className="list-none mt-2">
                {events.map(event => (
                    <li key={event.id} className="flex justify-between items-center p-2 border-b border-gray-300 text-sm transition duration-300 hover:bg-gray-100">
                        <span>{`${event.activity} (Dest: ${event.destination}, Date: ${event.date})`}</span>
                        <div>
                            <button onClick={() => handleEditEvent(event.id)} className="text-green-600 hover:text-green-800 mx-2">
                                ✏️
                            </button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-800">
                                🗑️
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingEvents;
