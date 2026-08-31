// client/src/components/Signup.js

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { NotebookPen, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from './ui';
import './Signup.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <NotebookPen size={26} aria-hidden="true" className="signup-header-icon" />
          <h2>Start your log</h2>
          <p>Create an account to start recording your trips.</p>
        </div>

        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            signup(values.username, values.email, values.password)
              .then(() => {
                navigate('/profile');
              })
              .catch((err) => {
                setFieldError('username', err.message || 'That username or email is already taken.');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form">
              <div>
                <Field as={Input} id="username" name="username" type="text" label="Username" icon={User} placeholder="Choose a username" />
                <ErrorMessage name="username" component="div" className="field-error" />
              </div>

              <div>
                <Field as={Input} id="email" name="email" type="email" label="Email" icon={Mail} placeholder="you@example.com" />
                <ErrorMessage name="email" component="div" className="field-error" />
              </div>

              <div>
                <Field as={Input} id="password" name="password" type="password" label="Password" icon={Lock} placeholder="At least 6 characters" />
                <ErrorMessage name="password" component="div" className="field-error" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="signup-submit">
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
