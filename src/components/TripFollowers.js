// client/src/components/TripFollowers.js

import React, { useState, useEffect } from 'react';
import { Users, UserMinus } from 'lucide-react';
import client from '../api/client';
import { Input, Button, Card, useToast } from './ui';
import './TripFollowers.css';

function TripFollowers({ tripId, user }) {
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const userId = user?.id;
  const toast = useToast();

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
    setSubmitting(true);
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
      .catch(error => {
        console.error('Error following trip:', error);
        toast.show('Could not follow this trip. Please try again.', { type: 'error' });
      })
      .finally(() => setSubmitting(false));
  };

  const handleUnfollow = () => {
    client
      .delete(`/trip-followers/${userId}/${tripId}`)
      .then(() => {
        setFollowers(followers.filter(f => f.user_id !== userId));
        setIsFollowing(false);
      })
      .catch(error => {
        console.error('Error unfollowing trip:', error);
        toast.show('Could not unfollow this trip. Please try again.', { type: 'error' });
      });
  };

  return (
    <Card className="trip-followers">
      <h3><Users size={18} aria-hidden="true" /> Following this trip ({followers.length})</h3>

      {user && (
        isFollowing ? (
          <Button variant="secondary" icon={UserMinus} onClick={handleUnfollow} className="follow-toggle">
            Unfollow
          </Button>
        ) : (
          <form onSubmit={handleFollow} className="follow-form">
            <Input
              id="follow-reason"
              type="text"
              placeholder="Why are you following this trip?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Following…' : 'Follow'}
            </Button>
          </form>
        )
      )}

      {followers.length > 0 && (
        <ul className="followers-list">
          {followers.map(follower => (
            <li key={follower.id}>
              <span className="follower-id">User #{follower.user_id}</span>
              {follower.reason_for_following && ` — ${follower.reason_for_following}`}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default TripFollowers;
