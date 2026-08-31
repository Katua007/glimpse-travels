// client/src/App.js

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import TripForm from './components/TripForm';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/trips" component={TripList} />
          <Route exact path="/trips/new" component={TripForm} />
          <Route exact path="/trips/:id/edit" component={TripForm} />
          <Route exact path="/trips/:id" component={TripDetail} />
          <Route exact path="/profile" component={UserProfile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
