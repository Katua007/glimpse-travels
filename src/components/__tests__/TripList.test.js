import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TripList from '../TripList';
import client from '../../api/client';

jest.mock('../../api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const TRIPS = [
  { id: 1, title: 'Machu Picchu Adventure', destination: 'Peru', start_date: '2027-06-01T00:00:00', end_date: '2027-06-08T00:00:00', photos: [], followers: [] },
  { id: 2, title: 'Tokyo in Spring', destination: 'Japan', start_date: '2027-04-01T00:00:00', end_date: '2027-04-10T00:00:00', photos: [], followers: [] },
];

function renderTripList() {
  return render(
    <MemoryRouter>
      <TripList />
    </MemoryRouter>
  );
}

describe('TripList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders trips fetched from the API', async () => {
    client.get.mockResolvedValueOnce(TRIPS);
    renderTripList();

    expect(await screen.findByText('Machu Picchu Adventure')).toBeInTheDocument();
    expect(screen.getByText('Tokyo in Spring')).toBeInTheDocument();
  });

  it('filters trips by continent', async () => {
    client.get.mockResolvedValueOnce(TRIPS);
    renderTripList();
    await screen.findByText('Machu Picchu Adventure');

    await userEvent.click(screen.getByRole('button', { name: 'Asia' }));

    expect(screen.getByText('Tokyo in Spring')).toBeInTheDocument();
    expect(screen.queryByText('Machu Picchu Adventure')).not.toBeInTheDocument();
  });

  it('shows an error state with a retry button when the request fails', async () => {
    client.get.mockRejectedValueOnce(new Error('Network error'));
    renderTripList();

    expect(await screen.findByText(/couldn't load trips/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /try again/i });

    client.get.mockResolvedValueOnce(TRIPS);
    await userEvent.click(retryButton);

    expect(await screen.findByText('Machu Picchu Adventure')).toBeInTheDocument();
  });

  it('shows an empty state inviting the user to create a trip when there are none', async () => {
    client.get.mockResolvedValueOnce([]);
    renderTripList();

    await waitFor(() => {
      expect(screen.getByText(/no trips in this category yet/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /create a trip/i })).toBeInTheDocument();
  });
});
