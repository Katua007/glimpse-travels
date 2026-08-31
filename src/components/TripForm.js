import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PenLine, MapPin, Calendar } from 'lucide-react';
import client from '../api/client';
import { Button, ErrorState, useToast } from './ui';
import './TripForm.css';

function getTripSchema(isEditing) {
  return Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Trip title is required'),
    destination: Yup.string()
      .min(2, 'Destination must be at least 2 characters')
      .max(50, 'Destination must be less than 50 characters')
      .required('Destination is required'),
    start_date: isEditing
      ? Yup.date().required('Start date is required')
      : Yup.date().min(new Date(), 'Start date cannot be in the past').required('Start date is required'),
    end_date: Yup.date()
      .required('End date is required')
      .min(Yup.ref('start_date'), 'End date must be after start date'),
  });
}

const popularDestinations = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK',
  'Rome, Italy', 'Barcelona, Spain', 'Bali, Indonesia', 'Dubai, UAE',
  'Sydney, Australia', 'Bangkok, Thailand', 'Istanbul, Turkey', 'Cairo, Egypt'
];

function TripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(id);
  const [initialValues, setInitialValues] = useState(isEditing ? null : {
    title: '', destination: '', start_date: '', end_date: ''
  });
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;
    client
      .get(`/trips/${id}`)
      .then(data => {
        if (cancelled) return;
        setInitialValues({
          title: data.title,
          destination: data.destination,
          start_date: data.start_date.split('T')[0],
          end_date: data.end_date.split('T')[0]
        });
      })
      .catch(error => {
        if (cancelled) return;
        console.error('Error fetching trip:', error);
        setLoadError('Could not load this trip.');
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  if (loadError) {
    return (
      <div className="trip-form-page">
        <ErrorState message={loadError} />
      </div>
    );
  }

  if (!initialValues) {
    return <div className="loading">Loading…</div>;
  }

  return (
    <div className="trip-form-page">
      <div className="trip-form-container">
        <div className="form-header">
          <h2>{isEditing ? 'Edit trip' : 'Log a new trip'}</h2>
          <p>
            {isEditing
              ? 'Update the details of this trip.'
              : 'Where did you go, and when?'
            }
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={getTripSchema(isEditing)}
          enableReinitialize
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            const request = id
              ? client.patch(`/trips/${id}`, values)
              : client.post('/trips', values);

            request
              .then(data => {
                setSubmitting(false);
                toast.show(isEditing ? 'Trip updated.' : 'Trip created.');
                navigate(`/trips/${data.id}`);
              })
              .catch((err) => {
                setSubmitting(false);
                setFieldError('title', err.message || 'Failed to save trip. Please try again.');
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="trip-form">
              <div className="form-row">
                <div className="field">
                  <label htmlFor="title" className="field-label"><PenLine size={14} aria-hidden="true" /> Trip title</label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="field-input"
                    placeholder="e.g., Two weeks in the Alps"
                  />
                  <ErrorMessage name="title" component="div" className="field-error" />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="destination" className="field-label"><MapPin size={14} aria-hidden="true" /> Destination</label>
                  <Field
                    id="destination"
                    name="destination"
                    type="text"
                    className="field-input"
                    placeholder="Where are you going?"
                    list="destinations"
                  />
                  <datalist id="destinations">
                    {popularDestinations.map(dest => (
                      <option key={dest} value={dest} />
                    ))}
                  </datalist>
                  <ErrorMessage name="destination" component="div" className="field-error" />
                </div>
              </div>

              <div className="form-row date-row">
                <div className="field">
                  <label htmlFor="start_date" className="field-label"><Calendar size={14} aria-hidden="true" /> Start date</label>
                  <Field id="start_date" name="start_date" type="date" className="field-input" />
                  <ErrorMessage name="start_date" component="div" className="field-error" />
                </div>

                <div className="field">
                  <label htmlFor="end_date" className="field-label"><Calendar size={14} aria-hidden="true" /> End date</label>
                  <Field id="end_date" name="end_date" type="date" className="field-input" />
                  <ErrorMessage name="end_date" component="div" className="field-error" />
                </div>
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? (isEditing ? 'Saving…' : 'Creating…')
                    : (isEditing ? 'Save changes' : 'Save trip')
                  }
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default TripForm;
