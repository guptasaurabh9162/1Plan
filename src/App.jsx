import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LogInContext } from "./Context/LogInContext/Login.jsx";
import toast from "react-hot-toast";

// Custom Components
import Header from "./components/custom/Header.jsx";
import Footer from "./components/custom/Footer.jsx";

// Route Components
import Hero from "./components/custom/Hero.jsx";
import CreateTrip from "./components/routes/plan-a-trip/CreateTrip.jsx";
import Calendar from "./components/routes/my-calendar/Calendar.jsx";
import MatchWithFriends from "./components/routes/my-calendar/MatchWithFriends.jsx";
import EcoTrack from "./components/routes/eco-track/EcoTrack.jsx";
import Rewards from "./components/routes/my-rewards/Rewards.jsx";
import ScrapBook from "./components/routes/scrap-book/ScrapBook.jsx";
import ToDo from "./components/routes/todo/Todo.jsx";
import MyTrips from "./components/routes/my-trips/[tripId]/Mytrips.jsx";
import AllTrips from "./components/routes/all-trips/Alltrips.jsx";
import Wanderlist from "./components/routes/todo/Todo.jsx";
import UpcomingEvents from "./components/routes/upcoming-event/UpcomingEvent.jsx";
// import CalendarApp from "./components/CalendarApp";
// import MatchWithFriends from "./components/MatchWithFriends";

function App() {
  const { user, isAuthenticated } = useContext(LogInContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("calendar"); // For toggle between Calendar and MatchWithFriends

  useEffect(() => {
    if (!loggedIn && isAuthenticated) {
      setLoggedIn(true);
      toast.success("Logged In Successfully");
    }
  }, [user, isAuthenticated]);

  return (
    <div className="app min-h-screen bg-gray-900">
      <Header />
      {/* <main className="container max-w-[1024px] w-full min-w-[320px] h-auto"> */}
      <main className="w-full h-screen m-0 p-0">

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/plan-a-trip" element={<CreateTrip />} />
          <Route path="/eco-track" element={<EcoTrack />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/scrapBook" element={<ScrapBook />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/wanderlist" element={<Wanderlist />} />
          <Route path="/upcoming-event" element={<UpcomingEvents />} />

          {/* Protected Routes */}
          <Route path="/my-trips/:tripId" element={isAuthenticated ? <MyTrips /> : <Navigate to="/" />} />
          <Route path="/all-trips" element={isAuthenticated ? <AllTrips /> : <Navigate to="/" />} />

          {/* Calendar & MatchWithFriends Toggle */}
          <Route
            path="/calendar"
            element={
              currentView === "calendar" ? (
                <Calendar onMatchClick={() => setCurrentView("match")} />
              ) : (
                <MatchWithFriends onBackClick={() => setCurrentView("calendar")} />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
