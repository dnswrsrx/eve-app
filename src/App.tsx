import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/main/Main';
import Admin from './components/admin/Admin';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-dashboard" component={Admin} />
        <Route path="/" component={Main} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
