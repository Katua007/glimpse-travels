import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Camera, Users, Map } from 'lucide-react';
import { Button } from './ui';
import RecommendedProfiles from './RecommendedProfiles';
import './Home.css';

const FEATURES = [
  {
    to: '/trips/new',
    icon: Camera,
    title: 'Log a trip',
    body: 'Record dates, a destination, and the photos that were actually taken there.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  },
  {
    to: '/profile',
    icon: Users,
    title: 'Follow along',
    body: 'Other travelers can follow a trip and see it update as you go.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
  },
  {
    to: '/trips',
    icon: Map,
    title: 'Browse the log',
    body: 'Explore trips other people have kept, filtered by continent.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
];

function Home() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 },
    },
  };

  const rise = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
  };

  return (
    <div className="home">
      <motion.section className="hero" initial="hidden" animate="show" variants={container}>
        <div className="hero-content">
          <motion.h1 variants={rise}>Every trip, kept.</motion.h1>
          <motion.p variants={rise}>
            Log where you went, mount the photos, and see who's following along.
          </motion.p>
          <motion.div className="hero-buttons" variants={rise}>
            <Button to="/trips">Explore trips</Button>
            <Button to="/signup" variant="secondary">Start your log</Button>
          </motion.div>
        </div>
        <motion.div className="hero-image" variants={rise}>
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
            alt="A traveler's map, camera, and field notebook laid out on a table"
          />
        </motion.div>
      </motion.section>

      <section className="features">
        {FEATURES.map(({ to, icon: Icon, title, body, image }) => (
          <Link key={to} to={to} className="feature">
            <img src={image} alt="" />
            <Icon size={22} aria-hidden="true" className="feature-icon" />
            <h3>{title}</h3>
            <p>{body}</p>
          </Link>
        ))}
      </section>

      <RecommendedProfiles />
    </div>
  );
}

export default Home;
