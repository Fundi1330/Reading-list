import { cleanup, render, screen, waitFor } from '@testing-library/react';
import SignUp from './SignUp';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mocked,
} from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import axios, { AxiosError } from 'axios';
import AlertList from '../../components/AlertList/AlertList';
import AlertProvider from '../../context/Alert/AlertProvider';

describe('SignUp', () => {
  const mockedAxios = axios as Mocked<typeof axios>;
  beforeEach(() => {
    vi.mock('axios');
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('successful sign up', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'User1',
        email: 'user1@gmail.com',
        password_hash: '1234AA5678',
        books: [],
      },
    });

    render(
      <AlertProvider>
        <BrowserRouter>
          <SignUp />
          <AlertList />
        </BrowserRouter>
      </AlertProvider>
    );

    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    const username = screen.getByLabelText(/username/i);
    await userEvent.type(username, '1234AA5678');

    const email = screen.getByLabelText(/email/i);
    await userEvent.type(email, 'user1@gmail.com');

    const password = screen.getByLabelText(/^password$/i);
    await userEvent.type(password, 'qwertY1234');

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await userEvent.type(confirmPassword, 'qwertY1234');

    const submit = screen.getByText(/Sign Up!/i);
    await userEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/signed up/i)).toBeInTheDocument();
    });
  });

  it('unsuccessful authorization', async () => {
    const axiosError = new AxiosError('Request failed');
    (axiosError as any).response = {
      status: 400,
      message: 'Sign up failed!',
      statusText: 'Bad Request',
      headers: {},
      config: {},
    };
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    render(
      <AlertProvider>
        <BrowserRouter>
          <SignUp />
          <AlertList />
        </BrowserRouter>
      </AlertProvider>
    );

    const username = screen.getByLabelText(/username/i);
    await userEvent.type(username, '1234AA5678');

    const email = screen.getByLabelText(/email/i);
    await userEvent.type(email, 'user1@gmail.com');

    const password = screen.getByLabelText(/^password$/i);
    await userEvent.type(password, 'qwertY1234');

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await userEvent.type(confirmPassword, 'qwertY1234');

    const submit = screen.getByText(/Sign Up!/i);
    await userEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/sign up failed/i)).toBeInTheDocument();
    });
  });
});
