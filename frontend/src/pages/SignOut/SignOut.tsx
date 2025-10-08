import axios, { type AxiosHeaderValue } from 'axios';
import { useNavigate } from 'react-router';
import { useUser } from '../../hooks/useUser';

const SignOut = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  axios
    .get(import.meta.env.VITE_BACKEND_URL + 'csrf', {
      withCredentials: true,
    })
    .then((response) => {
      const csrfToken = response.headers['x-csrf-token'];

      axios
        .post(
          import.meta.env.VITE_BACKEND_URL + `/auth/sign-out/`,
          {},
          {
            headers: {
              'X-CSRFToken': csrfToken as AxiosHeaderValue,
            },
          }
        )
        .then(() => {
          setUser(null);
          navigate('/auth/sign-in/');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  return <></>;
};

export default SignOut;
