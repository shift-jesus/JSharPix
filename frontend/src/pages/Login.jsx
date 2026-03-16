import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(username, password)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Usuario o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <div className="auth-brand-large">
                    <span className="brand-j">J</span>
                    <span className="brand-rest">SHARPIX</span>
                </div>
                <p className="auth-tagline">
                    Tu biblioteca visual privada. Organiza, explora y comparte fotografías de alta calidad.
                </p>
            </div>
            <div className="auth-right">
                <h1>Iniciar sesión</h1>
                <p className="auth-sub">Bienvenido de nuevo</p>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary full-width" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="auth-switch">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    )
}

export default Login