import React from 'react';
import { Link } from 'react-router-dom';
import RecommendedProfiles from './RecommendedProfiles';
import './Home.css';

function Home({ user }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Share your travel experiences and explore amazing destinations around the world</p>
          <div className="hero-buttons">
            <Link to="/trips" className="btn btn-primary">Explore Trips</Link>
            <Link to="/signup" className="btn btn-secondary">Join Community</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop" alt="Travel Adventure" />
        </div>
      </section>

      <section className="features">
        <Link to="/trips/new" className="feature">
          <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop" alt="Nature" />
          <h3>Document Adventures</h3>
          <p>Create detailed trip logs with photos and memories</p>
        </Link>
        <Link to="/profile" className="feature">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop" alt="Ocean" />
          <h3>Share Experiences</h3>
          <p>Connect with fellow travelers and share your journeys</p>
        </Link>
        <Link to="/trips" className="feature">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Mountains" />
          <h3>Discover Places</h3>
          <p>Find inspiration for your next travel destination</p>
        </Link>
      </section>
      
      <RecommendedProfiles currentUser={user} />
    </div>
  );
}

export default Home;