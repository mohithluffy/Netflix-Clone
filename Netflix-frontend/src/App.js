import React, { useEffect } from 'react';
import './App.css';
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/counter/userSlice';
import MovieDetails from './screens/MovieDetails';
import Likedscreen from './screens/Likedscreen';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // Logged in
        console.log(userAuth);
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
      } else {
        // Logged out
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
  return (
    <div className="app">
      <Router>
        {!user?(
          <Loginscreen/>
        ):(
          <Routes>
          <Route path='/' element={<Homescreen/>}>
          </Route>

          <Route path='/profile' element={<Profilescreen/>}>
          </Route>
          <Route path='/liked' element={<Likedscreen/>}>
          </Route>

          <Route path='/movie/:movieId' element={<MovieDetails/>}>
          </Route>
          </Routes>
        )}
        
      </Router>
    </div>
  );
}

export default App;
