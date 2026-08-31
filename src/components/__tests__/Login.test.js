import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';
import client, { getToken, setToken } from '../../api/client';

jest.mock('../../api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
  getToken: jest.fn(),
  setToken: jest.fn(),
}));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<div>Profile page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getToken.mockReturnValue(null);
  });

  it('logs in and navigates to /profile on success', async () => {
    client.post.mockResolvedValueOnce({
      token: 'fake-token',
      user: { id: 1, username: 'alice', email: 'alice@example.com' },
    });

    renderLogin();

    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Profile page')).toBeInTheDocument();
    });

    expect(client.post).toHaveBeenCalledWith('/login', { username: 'alice', password: 'password123' });
    expect(setToken).toHaveBeenCalledWith('fake-token');
  });

  it('shows an error and stays on the page when credentials are wrong', async () => {
    client.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderLogin();

    await userEvent.type(screen.getByLabelText(/username/i), 'alice');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/incorrect username or password/i)).toBeInTheDocument();
    expect(screen.queryByText('Profile page')).not.toBeInTheDocument();
  });

  it('requires both fields before submitting', async () => {
    renderLogin();

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(client.post).not.toHaveBeenCalled();
  });
});
