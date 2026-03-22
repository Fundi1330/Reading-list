import './SignIn.css';
import { Link, useNavigate } from 'react-router';
import { GoogleSignInButton, SignInAuthScreen } from '@firebase-oss/ui-react';
import useOAuthRedirectStrategy from '../../hooks/useOAuthRedirectStrategy';
import { googleProvider } from '../../firebase';

function SignIn() {
  const navigate = useNavigate();
  useOAuthRedirectStrategy();

  const handleSignIn = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className='flex justify-center'>
      <SignInAuthScreen onSignIn={handleSignIn}>
        <GoogleSignInButton onSignIn={handleSignIn} provider={googleProvider} />
        <Link to={'/auth/sign-up'}>Haven't got an account? Create one!</Link>
      </SignInAuthScreen>
    </div>
  );
}

export default SignIn;
