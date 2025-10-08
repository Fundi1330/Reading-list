import { cleanup, render, screen, waitFor } from '@testing-library/react';
import NavBar from './NavBar';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router';
import { useUser } from '../../hooks/useUser';

describe('NavBar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
    vi.mock('../../hooks/useUser', () => ({
      useUser: vi.fn(),
    }));
    (useUser as Mock).mockReturnValue({
      user: null,
    });
  });

  it('renders link for unathorized user', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('renders link for authorized user', async () => {
    (useUser as Mock).mockReturnValue({
      user: {
        id: 1,
        username: 'Test',
        email: 'test@gmail.com',
        password_hash: '12341234',
        books: [],
      },
    });

    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
    });
  });
});
