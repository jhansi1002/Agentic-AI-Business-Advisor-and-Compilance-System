import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wizard from './pages/Wizard';
import './index.css';

function App() {
  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      
      <BrowserRouter>
        <div className="container">
          <header className="header">
            <h1 className="gradient-text">AI Business Advisor</h1>
            <p>Your strategic partner in launching successful ventures in India.</p>
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<Wizard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
