// client/src/components/Login.js

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from './ui';
import './Login.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <KeyRound size={26} aria-hidden="true" className="login-header-icon" />
          <h2>Welcome back</h2>
          <p>Sign in to keep your travel log going.</p>
        </div>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            login(values.username, values.password)
              .then(() => {
                navigate('/profile');
              })
              .catch(() => {
                setFieldError('password', 'Incorrect username or password.');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div>
                <Field as={Input} id="username" name="username" type="text" label="Username" icon={User} placeholder="Your username" />
                <ErrorMessage name="username" component="div" className="field-error" />
              </div>

              <div>
                <Field as={Input} id="password" name="password" type="password" label="Password" icon={Lock} placeholder="Your password" />
                <ErrorMessage name="password" component="div" className="field-error" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="login-submit">
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          <p>New here? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
