import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import './TripForm.css';

const TripSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Trip title is required'),
  destination: Yup.string()
    .min(2, 'Destination must be at least 2 characters')
    .max(50, 'Destination must be less than 50 characters')
    .required('Destination is required'),
  start_date: Yup.date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
});

function TripForm() {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }

    if (id) {
      setIsEditing(true);
      client
        .get(`/trips/${id}`)
        .then(data => {
          setInitialValues({
            title: data.title,
            destination: data.destination,
            start_date: data.start_date.split('T')[0],
            end_date: data.end_date.split('T')[0]
          });
        })
        .catch(error => {
          console.error('Error fetching trip:', error);
          history.push('/trips');
        });
    } else {
      setInitialValues({
        title: '',
        destination: '',
        start_date: '',
        end_date: ''
      });
    }
  }, [user, id, history]);

  if (!initialValues) {
    return <div className="loading">🌍 Loading...</div>;
  }

  const popularDestinations = [
    'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK',
    'Rome, Italy', 'Barcelona, Spain', 'Bali, Indonesia', 'Dubai, UAE',
    'Sydney, Australia', 'Bangkok, Thailand', 'Istanbul, Turkey', 'Cairo, Egypt'
  ];

  return (
    <div className="trip-form-page">
      <div className="trip-form-container">
        <div className="form-header">
          <h2>
            {isEditing ? '✏️ Edit Your Adventure' : '✨ Plan Your Next Adventure'}
          </h2>
          <p>
            {isEditing 
              ? 'Update your trip details and make it even better'
              : 'Create a new trip and start documenting your journey'
            }
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={TripSchema}
          enableReinitialize
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            const request = id
              ? client.patch(`/trips/${id}`, values)
              : client.post('/trips', values);

            request
              .then(data => {
                setSubmitting(false);
                history.push(`/trips/${data.id}`);
              })
              .catch(() => {
                setSubmitting(false);
                setFieldError('title', 'Failed to save trip. Please try again.');
              });
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="trip-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">🎨 Trip Title</label>
                  <Field 
                    name="title" 
                    type="text" 
                    placeholder="e.g., Amazing European Adventure"
                  />
                  <ErrorMessage name="title" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="destination">📍 Destination</label>
                  <Field name="destination">
                    {({ field }) => (
                      <div className="destination-input">
                        <input
                          {...field}
                          type="text"
                          placeholder="Where are you going?"
                          list="destinations"
                        />
                        <datalist id="destinations">
                          {popularDestinations.map(dest => (
                            <option key={dest} value={dest} />
                          ))}
                        </datalist>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="destination" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-row date-row">
                <div className="form-group">
                  <label htmlFor="start_date">📅 Start Date</label>
                  <Field name="start_date" type="date" />
                  <ErrorMessage name="start_date" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end_date">🏁 End Date</label>
                  <Field name="end_date" type="date" />
                  <ErrorMessage name="end_date" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? '💾 Update Trip' : '✨ Create Trip')
                  }
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default TripForm;