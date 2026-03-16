import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <span className="brand-j">J</span>
                <span className="brand-rest">SHARPIX</span>
            </Link>
            <div className="nav-links">
                <Link to="/">Galería</Link>
                <Link to="/upload" className="btn-primary">+ Subir</Link>
                <span className="nav-user">{user?.username}</span>
                <button onClick={handleLogout} className="nav-logout">Salir</button>
            </div>
        </nav>
    )
}

export default Navbar