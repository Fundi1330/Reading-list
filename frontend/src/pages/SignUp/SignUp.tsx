import './SignUp.css';
import { Link, useNavigate } from 'react-router';
import { GoogleSignInButton, SignUpAuthScreen } from '@firebase-oss/ui-react';
import useOAuthRedirectStrategy from '../../hooks/useOAuthRedirectStrategy';
import { googleProvider } from '../../firebase';

function SignUp() {
  const navigate = useNavigate();
  useOAuthRedirectStrategy();

  const handleSignUp = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className='flex justify-center'>
      <SignUpAuthScreen onSignUp={handleSignUp}>
        <GoogleSignInButton onSignIn={handleSignUp} provider={googleProvider} />
        <Link to={'/auth/sign-in'}>Already have an account? Sign in!</Link>
      </SignUpAuthScreen>
    </div>
  );
}

export default SignUp;