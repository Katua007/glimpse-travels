// client/src/App.js

import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { API_BASE_URL } from './config';
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
    fetch(`${API_BASE_URL}/check_session`)
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
    fetch(`${API_BASE_URL}/logout`, { method: 'DELETE' }).then(() => {
      setUser(null);
    });
  }

  return (
    <div className="App">
      <NavBar user={user} onLogout={onLogout} />
      <main>
      <Switch>
        <Route exact path="/" render={(props) => <Home {...props} user={user} />} />
        <Route exact path="/trips" component={TripList} />
        <Route exact path="/trips/new" render={(props) => <TripForm {...props} user={user} />} />
        <Route exact path="/trips/:id/edit" render={(props) => <TripForm {...props} user={user} />} />
        <Route exact path="/trips/:id" render={(props) => <TripDetail {...props} user={user} />} />
        <Route exact path="/profile" render={(props) => <UserProfile {...props} user={user} />} />
        <Route exact path="/login" render={(props) => <Login {...props} onLogin={onLogin} />} />
        <Route exact path="/signup" render={(props) => <Signup {...props} onLogin={onLogin} />} />
      </Switch>
      </main>
    </div>
  );
}

export default App;