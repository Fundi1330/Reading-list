import { cleanup, render, screen, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import axios, { AxiosError } from 'axios';
import AlertList from '../../components/AlertList/AlertList';
import AlertProvider from '../../context/Alert/AlertProvider';

describe('SignIn', () => {
  const mockedAxios = axios as Mocked<typeof axios>;
  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
    vi.mock('axios');
    mockedAxios.get.mockResolvedValueOnce({
      headers: {
        'x-csrf-token': 'Test',
      },
    });
  });

  it('successful sign in', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'TestUser',
        email: 'test@gmail.com',
        password_hash: 'qwertY1234',
        books: [],
      },
    });

    render(
      <AlertProvider>
        <BrowserRouter>
          <SignIn />
          <AlertList />
        </BrowserRouter>
      </AlertProvider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();

    const username = screen.getByLabelText(/username/i);
    await userEvent.type(username, 'TestUser');
    expect((username as HTMLInputElement).value).toBe('TestUser');

    const password = screen.getByLabelText(/password/i);
    await userEvent.type(password, 'qwertY1234');
    expect((password as HTMLInputElement).value).toBe('qwertY1234');

    const submit = screen.getByText(/Sign In!/i);
    await userEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/signed into/i)).toBeInTheDocument();
    });
  });

  it('unsuccessful sign in', async () => {
    const axiosError = new AxiosError('Request failed');
    (axiosError as any).response = {
      status: 400,
      message: 'Sign in unsuccessful!',
      statusText: 'Bad Request',
      headers: {},
      config: {},
    };
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    render(
      <AlertProvider>
        <BrowserRouter>
          <SignIn />
          <AlertList />
        </BrowserRouter>
      </AlertProvider>
    );

    const username = screen.getByLabelText(/username/i);
    await userEvent.type(username, 'TestUser');
    const password = screen.getByLabelText(/password/i);
    await userEvent.type(password, 'qwertY1234');

    const submit = screen.getByText(/Sign In!/i);
    await userEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/sign in unsuccessful/i)).toBeInTheDocument();
    });
  });
});
