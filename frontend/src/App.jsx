import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import Upload from './pages/Upload'
import PhotoDetail from './pages/PhotoDetail'
import Guest from './pages/Guest'

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/login"    element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/guest"    element={<Guest />} />
                        <Route path="/"         element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                        <Route path="/upload"   element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                        <Route path="/photo/:id" element={<ProtectedRoute><PhotoDetail /></ProtectedRoute>} />
                        <Route path="*"         element={<Navigate to="/login" />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App