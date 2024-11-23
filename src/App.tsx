import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Summary from './pages/Summary';
import Answer from './pages/Answer';
import Chat from './pages/Chat';
import { TextProvider } from './context/TextContext';

function App() {
  return (
    <BrowserRouter>
      <TextProvider>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          <main className="container mx-auto px-4 pb-20 pt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/answer" element={<Answer />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </TextProvider>
    </BrowserRouter>
  );
}

export default App;