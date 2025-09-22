// client/src/components/Login.js

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

function Login({ onLogin }) {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Invalid credentials');
          })
          .then(user => {
            onLogin(user); // Callback to set user in App.js state
            navigate('/profile');
          })
          .catch(error => {
            console.error('Login error:', error);
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h2>Login</h2>
          <div>
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default Login;