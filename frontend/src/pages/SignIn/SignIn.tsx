import { useContext, useState, type ChangeEvent, type FormEvent } from 'react';
import Submit from '../../components/Submit/Submit';
import './SignIn.css';
import { Link, useNavigate } from 'react-router';
import Input from '../../components/Input/Input';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import type { AlertType } from '../../components/Alert/Alert';
import { v4 } from 'uuid';
import axios from 'axios';
import {
  AlertContext,
  type AlertContextType,
} from '../../context/Alert/AlertContext';
import { useUser } from '../../hooks/useUser';

function SignIn() {
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setAlerts } = useContext<AlertContextType>(AlertContext);
  const { setUser } = useUser();

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.target as HTMLFormElement);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + 'auth/sign-in/', formData, {
        withCredentials: true,
      })
      .then((res) => {
        const alert: AlertType = {
          id: v4(),
          children: 'You have successfully signed into your account!',
          className: 'alert-success',
        };
        setAlerts((alerts: AlertType[]) => [...alerts, alert]);

        setTimeout(() => {
          setAlerts((alerts: AlertType[]) =>
            alerts.filter((a) => {
              return !(a.id === alert.id);
            })
          );
        }, 2000);
        setUser(res.data);
        navigate('/');
      })

      .catch((err) => {
        console.log;
        const alert: AlertType = {
          id: v4(),
          children: err.response.message,
          className: 'alert-error',
        };
        setAlerts((alerts: AlertType[]) => [...alerts, alert]);
        setTimeout(() => {
          setAlerts((alerts: AlertType[]) =>
            alerts.filter((a) => {
              return !(a.id === alert.id);
            })
          );
        }, 2000);
      });
  };

  const handlePasswordChange = (ev: ChangeEvent<Element>) => {
    setPassword((ev.target as HTMLInputElement).value);
  };

  return (
    <>
      <h1 className='text-4xl'>Sign In</h1>
      <div className='auth-form-container'>
        <form className='auth-form w-1/6' onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              name='username'
              autoComplete='username'
              className='input'
              required
              minLength={4}
              maxLength={32}
              placeholder='Enter your username...'
            />
          </fieldset>
          <fieldset>
            <label htmlFor='password'>Password</label>
            <PasswordInput>
              <Input
                type='password'
                id='password'
                name='password'
                onChange={handlePasswordChange}
                value={password}
                className='input'
                autoComplete='current-password'
                placeholder='Enter your password...'
                maxLength={32}
              />
            </PasswordInput>
          </fieldset>
          <fieldset className='!flex-row gap-1 items-center'>
            <input
              type='checkbox'
              className='m-0 !bg-gray-600 !text-blue-700 cursor-pointer rounded !w-4 !h-4 '
              name='remember-me'
              id='remember-me'
              value={'rememberme'}
            />
            <label htmlFor='remember-me'>Remember Me!</label>
          </fieldset>
          <Submit className='submit-btn' value='Sign In!' />
        </form>
      </div>
      <Link to={'/auth/sign-up'}>Haven't got an account? Create one!</Link>
    </>
  );
}

export default SignIn;
