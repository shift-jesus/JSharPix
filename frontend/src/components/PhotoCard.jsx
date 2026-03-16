import { Link } from 'react-router-dom'
import api from '../services/api'

function PhotoCard({ photo, onDelete }) {
    const handleDelete = async (e) => {
        e.preventDefault()
        if (!confirm('¿Eliminar esta foto?')) return
        try {
            await api.delete(`/photos/${photo.id}`)
            onDelete(photo.id)
        } catch {
            alert('Error al eliminar la foto')
        }
    }

    return (
        <Link to={`/photo/${photo.id}`} className="photo-card">
            <div className="photo-thumb">
                <img
                    src={`http://localhost:5000/api/photos/file/${photo.filename}`}
                    alt={photo.title}
                    loading="lazy"
                />
            </div>
            <div className="photo-info">
                <p className="photo-title">{photo.title}</p>
                <p className="photo-date">
                    {new Date(photo.uploaded_at).toLocaleDateString('es-ES')}
                </p>
                <button
                    className="photo-delete"
                    onClick={handleDelete}
                >
                    Eliminar
                </button>
            </div>
        </Link>
    )
}

export default PhotoCard