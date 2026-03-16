import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PhotoCard from '../components/PhotoCard'
import api from '../services/api'

function Gallery() {
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPhotos()
    }, [])

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/photos')
            setPhotos(res.data)
        } catch {
            setError('Error al cargar las fotos')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id) => {
        setPhotos(photos.filter(p => p.id !== id))
    }

    return (
        <div className="page">
            <Navbar />
            <div className="main-content">
                <div className="gallery-header">
                    <h1>Mi galería</h1>
                    <span className="photo-count">
            {photos.length} foto{photos.length !== 1 ? 's' : ''}
          </span>
                </div>

                {loading && <p className="loading-text">Cargando fotos...</p>}
                {error && <div className="alert alert-error">{error}</div>}

                {!loading && photos.length === 0 && (
                    <div className="empty-state">
                        <p>Aún no tienes fotos.</p>
                        <Link to="/upload" className="btn-primary">
                            Subir tu primera foto
                        </Link>
                    </div>
                )}

                {!loading && photos.length > 0 && (
                    <div className="photo-grid">
                        {photos.map(photo => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gallery