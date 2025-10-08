import SignUp from './pages/SignUp/SignUp.tsx';
import SignIn from './pages/SignIn/SignIn.tsx';
import Home from './pages/Home/Home.tsx';
import AlertList from './components/AlertList/AlertList.tsx';
import NavBar from './components/NavBar/NavBar.tsx';
import { Route, Routes } from 'react-router';
import SignOut from './pages/SignOut/SignOut.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';

function App() {
  return (
    <>
      <header className='m-3 p-2'>
        <NavBar />
        <AlertList />
      </header>
      <main className='flex flex-col overflow-hidden'>
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='auth'>
            <Route path='sign-in' element={<SignIn />} />
            <Route path='sign-up' element={<SignUp />} />
            <Route path='sign-out' element={<SignOut />} />
          </Route>
        </Routes>
      </main>
      <footer className='m-3 p-2'>Made by Fundi1330 with ❤️</footer>
    </>
  );
}

export default App;
