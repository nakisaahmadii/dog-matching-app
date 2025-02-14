import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Search from './components/search';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/dog-matching-app'  element={<Login />} />  {/* Routs for the root path to render Login */}
        <Route path='/search' element={<Search />} /> {/* Routs for '/search' path to render Search */}
      </Routes>
    </div>
  );
}

export default App;
