import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import GalleryPage from './pages/GalleryPage';
import AddImagePage from './pages/AddImagePage';
import ImageViewPage from './pages/ImageViewPage';

function App() {
    return (
        <AuthProvider>
            <ImageProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
                        <Route path="/add" element={<ProtectedRoute><AddImagePage /></ProtectedRoute>} />
                        <Route path="/view/:number" element={<ProtectedRoute><ImageViewPage /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </ImageProvider>
        </AuthProvider>
    );
}

export default App;
