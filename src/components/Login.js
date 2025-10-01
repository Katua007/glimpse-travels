// client/src/components/Login.js

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Login.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function Login({ onLogin }) {
  const history = useHistory();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>🔑 Welcome Back</h2>
          <p>Sign in to continue your travel journey</p>
        </div>
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            fetch(`${API_BASE_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(values),
            })
              .then(res => {
                if (res.ok) {
                  return res.json();
                }
                throw new Error('Invalid credentials');
              })
              .then(user => {
                onLogin(user);
                history.push('/profile');
              })
              .catch(error => {
                setFieldError('password', 'Invalid username or password');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">👤 Username</label>
                <Field name="username" type="text" placeholder="Enter your username" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">🔒 Password</label>
                <Field name="password" type="password" placeholder="Enter your password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              
              <button type="submit" disabled={isSubmitting} className="login-btn">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Join us today!</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;