// client/src/components/TripFollowers.js

import React, { useState, useEffect } from 'react';

function TripFollowers({ tripId }) {
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reason, setReason] = useState('');
  const userId = 1; // NOTE: Replace with dynamic user ID

  useEffect(() => {
    // Fetch followers for this specific trip
    fetch(`/trips/${tripId}/followers`)
      .then(res => res.json())
      .then(data => {
        setFollowers(data);
        // Check if the current user is already following
        const userFollows = data.some(follower => follower.user_id === userId);
        setIsFollowing(userFollows);
      })
      .catch(error => console.error('Error fetching followers:', error));
  }, [tripId, userId]);

  const handleFollow = (e) => {
    e.preventDefault();
    fetch('/trip-followers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        trip_id: tripId,
        reason_for_following: reason
      })
    })
    .then(res => res.json())
    .then(newFollower => {
      setFollowers([...followers, newFollower]);
      setIsFollowing(true);
      setReason('');
    });
  };

  const handleUnfollow = () => {
    // NOTE: You'll need a backend DELETE route for this. Example: /trip-followers/user_id/trip_id
    fetch(`/trip-followers/${userId}/${tripId}`, {
      method: 'DELETE'
    }).then(() => {
      setFollowers(followers.filter(f => f.user_id !== userId));
      setIsFollowing(false);
    });
  };

  return (
    <div>
      <h3>Trip Followers ({followers.length})</h3>
      {isFollowing ? (
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
      )}
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>
            {follower.user.username} - {follower.reason_for_following}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripFollowers;