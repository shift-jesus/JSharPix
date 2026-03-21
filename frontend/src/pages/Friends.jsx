import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import Upload from './pages/Upload'
import PhotoDetail from './pages/PhotoDetail'
import Guest from './pages/Guest'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import FriendGallery from './pages/FriendGallery'

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login"          element={<Login />} />
                            <Route path="/register"       element={<Register />} />
                            <Route path="/guest"          element={<Guest />} />
                            <Route path="/"               element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                            <Route path="/upload"         element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                            <Route path="/photo/:id"      element={<ProtectedRoute><PhotoDetail /></ProtectedRoute>} />
                            <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/friends"        element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                            <Route path="/friends/:userId" element={<ProtectedRoute><FriendGallery /></ProtectedRoute>} />
                            <Route path="*"               element={<Navigate to="/login" />} />
                        </Routes>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App