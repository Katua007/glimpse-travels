import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TripSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  destination: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  start_date: Yup.date().required('Required'),
  end_date: Yup.date()
    .required('Required')
    .min(Yup.ref('start_date'), 'End date cannot be before start date'),
});

function TripForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

   useEffect(() => {
    // Redirect if user is not logged in and is trying to create a new trip
    if (!user && !id) {
      navigate('/login');
    }
    if (id) {
      fetch(`/trips/${id}`)
        .then(res => res.json())
        .then(data => setInitialValues(data));
    } else {
      setInitialValues({
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        user_id: 1 // NOTE: Replace with dynamic user ID from state or context
      });
    }
  }, [user, id]);

  if (!initialValues) {
    return <div>Loading form...</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TripSchema}
      onSubmit={(values, { setSubmitting }) => {
        // Add the user_id to the values before submitting
    const tripData = {
      ...values,
      user_id: user.id
    };
        const url = id ? `/trips/${id}` : '/trips';
        const method = id ? 'PATCH' : 'POST';

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tripData),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to submit form');
            }
            return res.json();
          })
          .then(data => {
            setSubmitting(false);
            navigate(`/trips/${data.id}`);
          })
          .catch(error => {
            setSubmitting(false);
            console.error('Error:', error);
          });
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="form-container">
          <h2>{id ? 'Edit Trip' : 'Create a New Trip'}</h2>
          <div>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="destination">Destination</label>
            <Field name="destination" type="text" />
            <ErrorMessage name="destination" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="start_date">Start Date</label>
            <Field name="start_date" type="date" />
            <ErrorMessage name="start_date" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="end_date">End Date</label>
            <Field name="end_date" type="date" />
            <ErrorMessage name="end_date" component="div" className="error" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default TripForm;