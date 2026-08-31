// client/src/components/TripFollowers.js

import React, { useState, useEffect } from 'react';
import client from '../api/client';

function TripFollowers({ tripId, user }) {
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reason, setReason] = useState('');
  const userId = user?.id;

  useEffect(() => {
    // For now, we'll fetch all trip followers and filter by trip_id
    client
      .get('/trip-followers')
      .then(data => {
        const tripFollowers = data.filter(follower => follower.trip_id === parseInt(tripId));
        setFollowers(tripFollowers);
        const userFollows = tripFollowers.some(follower => follower.user_id === userId);
        setIsFollowing(userFollows);
      })
      .catch(error => console.error('Error fetching followers:', error));
  }, [tripId, userId]);

  const handleFollow = (e) => {
    e.preventDefault();
    client
      .post('/trip-followers', {
        user_id: userId,
        trip_id: tripId,
        reason_for_following: reason
      })
      .then(newFollower => {
        setFollowers([...followers, newFollower]);
        setIsFollowing(true);
        setReason('');
      })
      .catch(error => console.error('Error following trip:', error));
  };

  const handleUnfollow = () => {
    client
      .delete(`/trip-followers/${userId}/${tripId}`)
      .then(() => {
        setFollowers(followers.filter(f => f.user_id !== userId));
        setIsFollowing(false);
      })
      .catch(error => console.error('Error unfollowing trip:', error));
  };

 return (
    <div>
      <h3>Trip Followers ({followers.length})</h3>
      {user && ( // Conditionally render follow/unfollow buttons if user is logged in
        isFollowing ? (
          <button onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <form onSubmit={handleFollow}>
            <input
              type="text"
              placeholder="Reason for following"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <button type="submit">Follow</button>
          </form>
        )
      )}
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>
            User {follower.user_id} - {follower.reason_for_following}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripFollowers;