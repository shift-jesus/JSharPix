import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register(username, email, password)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la cuenta')
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
                    Únete a JSharPix y crea tu biblioteca visual privada hoy.
                </p>
            </div>
            <div className="auth-right">
                <h1>Crear cuenta</h1>
                <p className="auth-sub">Es gratis y solo toma un momento</p>
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
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn-primary full-width" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default Register