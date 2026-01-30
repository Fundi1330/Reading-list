import './SignUp.css';
import Input from '../../components/Input/Input';
import { useContext, useState, type ChangeEvent, type FormEvent } from 'react';
import InputError from '../../components/InputError/InputError';
import Submit from '../../components/Submit/Submit';
import { Link, useNavigate } from 'react-router';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import axios from 'axios';
import {
  AlertContext,
  type AlertContextType,
} from '../../context/Alert/AlertContext';
import type { AlertType } from '../../components/Alert/Alert';
import { v4 } from 'uuid';

function SignUp() {
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    length: '',
    capitalLetters: '',
    numbers: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    'no-match': '',
  });

  const { setAlerts } = useContext<AlertContextType>(AlertContext);
  const navigate = useNavigate();

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.target as HTMLFormElement);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + 'auth/sign-up/', formData, {
        withCredentials: true,
      })
      .then(() => {
        const alert: AlertType = {
          id: v4(),
          children: 'You have successfully signed up! Please, sign in',
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
        navigate('/auth/sign-in');
      })
      .catch((err) => {
        console.log(err);
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
  }

  const handlePasswordInput = (ev: ChangeEvent) => {
    setPassword((ev.target as HTMLInputElement).value);

    let newErrors = {
      length: '',
      capitalLetters: '',
      numbers: '',
    };

    const capitalLetters = new RegExp('[A-Z]+');
    const numbers = new RegExp(`\\d.*\\d`);
    const value = (ev.target as HTMLInputElement).value;
    if (value.length > 0) {
      if (!capitalLetters.test(value)) {
        newErrors.capitalLetters =
          'Your password must contain at least 1 capital letter!';
      } else if (!numbers.test(value)) {
        newErrors.numbers = 'Your password must contain at least 2 numbers!';
      } else if (value.length < 8) {
        newErrors.length = `Your password's length has to be at least 8 symbols!`;
      }
    }
    setPasswordErrors(newErrors);
  };
  const handleConfirmPasswordInput = (ev: ChangeEvent) => {
    let newErrors = {
      'no-match': '',
    };
    const pass = (ev.target as HTMLInputElement).value;
    setConfirmPassword(pass);

    if (password != pass) {
      newErrors['no-match'] = "The passwords don't match";
    }
    setConfirmPasswordError(newErrors);
  };

  return (
    <>
      <h1 className='text-4xl'>Sign Up</h1>
      <div className='auth-form-container'>
        <form className='auth-form w-1/6' onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              className='input'
              required
              autoComplete='email'
              minLength={5}
              maxLength={60}
              placeholder='Enter your email...'
            />
          </fieldset>
          <fieldset>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              name='username'
              className='input'
              autoComplete='username'
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
                autoComplete='new-password'
                placeholder='Enter your password...'
                value={password}
                onChange={handlePasswordInput}
                maxLength={32}
              />
            </PasswordInput>

            <li className='list-none block w-full text-center'>
              {Object.entries(passwordErrors).map((err) => (
                <InputError key={err[0]} className='max-w-1/3'>
                  {err[1]}
                </InputError>
              ))}
            </li>
          </fieldset>
          <fieldset>
            <label htmlFor='confirm-password'>Confirm password</label>
            <PasswordInput>
              <Input
                type='password'
                id='confirm-password'
                name='confirm-password'
                autoComplete='off'
                placeholder='Confirm your password...'
                value={confirmPassword}
                onChange={handleConfirmPasswordInput}
                maxLength={32}
              />
            </PasswordInput>
            <li className='list-none block w-full text-center'>
              <InputError className='max-w-1/3'>
                {confirmPasswordError['no-match']}
              </InputError>
            </li>
          </fieldset>

          <Submit className='submit-btn !w-1/2' value='Sign Up!' />
        </form>
      </div>
      <Link to={'/auth/sign-in'}>Already have an account? Sign In!</Link>
    </>
  );
}

export default SignUp;
