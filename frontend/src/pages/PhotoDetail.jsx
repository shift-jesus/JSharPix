import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function PhotoDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchPhoto()
    }, [id])

    const fetchPhoto = async () => {
        try {
            const res = await api.get(`/photos/${id}`)
            setPhoto(res.data)
        } catch {
            setError('No se pudo cargar la foto')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('¿Eliminar esta foto?')) return
        setDeleting(true)
        try {
            await api.delete(`/photos/${id}`)
            navigate('/')
        } catch {
            setError('Error al eliminar la foto')
            setDeleting(false)
        }
    }

    return (
        <div className="page">
            <Navbar />
            <div className="main-content">
                <Link to="/" className="back-link">← Volver a la galería</Link>

                {loading && <p className="loading-text">Cargando...</p>}
                {error && <div className="alert alert-error">{error}</div>}

                {photo && (
                    <div className="detail-container">
                        <img
                            src={`http://localhost:5000/api/photos/file/${photo.filename}`}
                            alt={photo.title}
                            className="detail-img"
                        />
                        <div className="detail-info">
                            <h2>{photo.title}</h2>
                            {photo.description && <p>{photo.description}</p>}
                            <p className="meta">
                                Subida el {new Date(photo.uploaded_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                            </p>
                            <button
                                className="btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Eliminando...' : 'Eliminar foto'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PhotoDetail