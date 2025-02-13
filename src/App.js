import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Search from './components/search';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div>
      <Routes>
        <Route path='/'  element={<Login />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
