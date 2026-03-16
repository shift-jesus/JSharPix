import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Upload() {
    const [files, setFiles] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [previews, setPreviews] = useState([])
    const navigate = useNavigate()

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files)
        setFiles(selected)
        const urls = selected.map(f => URL.createObjectURL(f))
        setPreviews(urls)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (files.length === 0) {
            setError('Selecciona al menos una foto')
            return
        }
        setLoading(true)
        setError('')
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('photos', f))
            formData.append('title', title)
            formData.append('description', description)
            await api.post('/photos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Error al subir las fotos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <Navbar />
            <div className="main-content">
                <div className="upload-container">
                    <h1>Subir fotos</h1>
                    {error && <div className="alert alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Fotos (PNG, JPG, GIF, WEBP · máx. 16MB c/u)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFiles}
                                required
                            />
                        </div>

                        {previews.length > 0 && (
                            <div className="preview-grid">
                                {previews.map((url, i) => (
                                    <img key={i} src={url} alt={`preview ${i}`} className="preview-img" />
                                ))}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Título (opcional)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Mi foto favorita"
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción (opcional)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Cuéntanos algo sobre esta foto..."
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Subiendo...' : 'Subir fotos'}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Upload