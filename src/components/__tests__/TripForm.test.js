import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TripForm from '../TripForm';
import client from '../../api/client';
import { ToastProvider } from '../ui';

jest.mock('../../api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

function renderForm(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <Routes>
          <Route path="/trips/new" element={<TripForm />} />
          <Route path="/trips/:id/edit" element={<TripForm />} />
          <Route path="/trips/:id" element={<div>Trip detail page</div>} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('TripForm validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires title, destination, and dates when creating a trip', async () => {
    renderForm('/trips/new');

    await userEvent.click(screen.getByRole('button', { name: /save trip/i }));

    expect(await screen.findByText(/trip title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
    expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
    expect(client.post).not.toHaveBeenCalled();
  });

  it('rejects a start date in the past when creating a trip', async () => {
    renderForm('/trips/new');

    await userEvent.type(screen.getByLabelText(/trip title/i), 'Old trip');
    await userEvent.type(screen.getByLabelText(/destination/i), 'Nowhere');
    await userEvent.type(screen.getByLabelText(/start date/i), '2020-01-01');
    await userEvent.type(screen.getByLabelText(/end date/i), '2020-01-05');
    await userEvent.click(screen.getByRole('button', { name: /save trip/i }));

    expect(await screen.findByText(/start date cannot be in the past/i)).toBeInTheDocument();
    expect(client.post).not.toHaveBeenCalled();
  });

  it('allows editing a trip that already started in the past', async () => {
    client.get.mockResolvedValueOnce({
      id: 5,
      title: 'Already happened',
      destination: 'Peru',
      start_date: '2020-01-01T00:00:00',
      end_date: '2020-01-05T00:00:00',
    });
    client.patch.mockResolvedValueOnce({ id: 5 });

    renderForm('/trips/5/edit');

    await waitFor(() => expect(screen.getByLabelText(/trip title/i)).toHaveValue('Already happened'));

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(client.patch).toHaveBeenCalled());
    expect(screen.queryByText(/start date cannot be in the past/i)).not.toBeInTheDocument();
  });
});
