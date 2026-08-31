// client/src/components/Signup.js

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Signup() {
  const history = useHistory();
  const { signup } = useAuth();

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2>🌍 Join Our Travel Community</h2>
          <p>Start documenting your adventures today</p>
        </div>

        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            signup(values.username, values.email, values.password)
              .then(() => {
                history.push('/profile');
              })
              .catch(() => {
                setFieldError('username', 'Username or email already exists');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form">
              <div className="form-group">
                <label htmlFor="username">👤 Username</label>
                <Field name="username" type="text" placeholder="Choose a unique username" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="email">📧 Email</label>
                <Field name="email" type="email" placeholder="Enter your email address" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">🔒 Password</label>
                <Field name="password" type="password" placeholder="Create a secure password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button type="submit" disabled={isSubmitting} className="signup-btn">
                {isSubmitting ? 'Creating Account...' : '✨ Join the Adventure'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
