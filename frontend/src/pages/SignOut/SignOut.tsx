import axios from 'axios';
import { useNavigate } from 'react-router';
import { useUser } from '../../hooks/useUser';

const SignOut = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  axios
    .post(
      import.meta.env.VITE_BACKEND_URL + `/auth/sign-out/`,
      {},
      {
        withCredentials: true,
      }
    )
    .then(() => {
      setUser(null);
      navigate('/auth/sign-in/');
    })
    .catch((err) => {
      console.log(err);
    });
  return <></>;
};

export default SignOut;
