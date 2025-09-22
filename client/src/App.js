// client/src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import TripForm from './components/TripForm';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Auto-login to check for a user in the session
    fetch('/check_session')
      .then(res => {
        if (res.ok) {
          res.json().then(user => setUser(user));
        }
      });
  }, []);

  function onLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function onLogout() {
    fetch('/logout', { method: 'DELETE' }).then(() => {
      setUser(null);
    });
  }

  return (
    <div className="App">
      <NavBar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/signup" element={<Signup onLogin={onLogin} />} />
      </Routes>
    </div>
  );
}

export default App;