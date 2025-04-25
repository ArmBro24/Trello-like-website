import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import Home from './pages/Home';
import BoardPage from './pages/BoardPage';
import Header from './utils/Header';
import Footer from './utils/Footer';
import './App.css';

function App() {
    return (
        <BoardProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/board/:id" element={<BoardPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </BoardProvider>
    );
}

export default App;
