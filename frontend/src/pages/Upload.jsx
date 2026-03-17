import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'

export default function Upload() {
    const [files, setFiles]             = useState([])
    const [previews, setPreviews]       = useState([])
    const [title, setTitle]             = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading]         = useState(false)
    const [progress, setProgress]       = useState(0)
    const [error, setError]             = useState('')
    const [dragging, setDragging]       = useState(false)
    const [focusField, setFocusField]   = useState('')
    const inputRef = useRef()
    const navigate = useNavigate()
    const t        = useTheme()
    const toast    = useToast()

    const processFiles = (selected) => {
        const valid = Array.from(selected).filter(f =>
            ['image/png','image/jpeg','image/gif','image/webp'].includes(f.type)
        )
        if (!valid.length) { setError('Solo se permiten imágenes PNG, JPG, GIF o WEBP'); return }
        setError('')
        setFiles(valid)
        setPreviews(valid.map(f => ({ url:URL.createObjectURL(f), name:f.name, size:(f.size/1024/1024).toFixed(2) })))
    }

    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false)
        processFiles(e.dataTransfer.files)
    }, [])

    const removeFile = (i) => {
        setFiles(f => f.filter((_,idx) => idx !== i))
        setPreviews(p => p.filter((_,idx) => idx !== i))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!files.length) { setError('Selecciona al menos una imagen'); return }
        setLoading(true); setProgress(0); setError('')
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('photos', f))
            formData.append('title', title)
            formData.append('description', description)
            await api.post('/photos/upload', formData, {
                headers:{ 'Content-Type':'multipart/form-data' },
                onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total))
            })
            toast(`¡${files.length} foto${files.length>1?'s':''} subida${files.length>1?'s':''} correctamente!`, 'success')
            setTimeout(() => navigate('/'), 1200)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al subir las fotos')
            toast('Error al subir las fotos', 'error')
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight:'100vh', background:t.bg, color:t.text, transition:'background .4s, color .4s' }}>
            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .prev-item { position:relative; border-radius:10px; overflow:hidden; aspect-ratio:1; transition:transform .25s,box-shadow .25s; }
        .prev-item:hover { transform:scale(1.03); box-shadow:0 8px 24px rgba(0,0,0,.4); }
        .prev-rm { position:absolute; top:6px; right:6px; background:rgba(217,92,92,.9); border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
        .prev-item:hover .prev-rm { opacity:1; }
      `}</style>

            <Navbar />

            <div style={{ padding:'40px 48px', maxWidth:800, margin:'0 auto', animation:'fadeUp .5s ease both' }}>
                <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, marginBottom:8, color:t.text }}>Subir fotos</h1>
                <p style={{ color:t.muted, fontSize:14, marginBottom:40, fontFamily:'Syne,sans-serif' }}>Arrastra tus imágenes o selecciónalas desde tu dispositivo</p>

                {error && <div style={{ padding:'13px 18px', background:'rgba(217,92,92,.08)', color:'#d95c5c', border:'1px solid rgba(217,92,92,.3)', borderRadius:8, fontSize:13, marginBottom:20 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Drop zone */}
                    <div
                        onDrop={onDrop}
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onClick={() => inputRef.current?.click()}
                        style={{ border:`2px dashed ${dragging?'#c9a84c':t.dark?'#2e2e38':'#c8b898'}`, borderRadius:14, padding:'52px 24px', textAlign:'center', cursor:'pointer', background:dragging?'rgba(201,168,76,0.06)':t.dark?'rgba(255,255,255,0.02)':'rgba(0,0,0,0.02)', transition:'border-color .25s,background .25s,transform .2s', transform:dragging?'scale(1.01)':'scale(1)', marginBottom:24 }}
                    >
                        <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => processFiles(e.target.files)} style={{ display:'none' }} />
                        <div style={{ fontSize:48, marginBottom:16 }}>📸</div>
                        <p style={{ color:t.text, fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:600, margin:'0 0 8px' }}>
                            {dragging ? 'Suelta aquí tus fotos' : 'Arrastra fotos aquí'}
                        </p>
                        <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:13, margin:0 }}>
                            o haz clic para seleccionar · PNG, JPG, GIF, WEBP · máx. 16MB
                        </p>
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div style={{ marginBottom:28 }}>
                            <p style={{ color:t.muted, fontSize:12, fontWeight:600, letterSpacing:1, textTransform:'uppercase', marginBottom:14, fontFamily:'Syne,sans-serif' }}>
                                {previews.length} imagen{previews.length>1?'es':''} seleccionada{previews.length>1?'s':''}
                            </p>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
                                {previews.map((p,i) => (
                                    <div key={i} className="prev-item">
                                        <img src={p.url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 6px 6px', background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }}>
                                            <p style={{ color:'#f0efe8', fontSize:10, fontFamily:'Syne,sans-serif', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</p>
                                            <p style={{ color:'rgba(240,239,232,0.6)', fontSize:10, fontFamily:'Syne,sans-serif', margin:'2px 0 0' }}>{p.size} MB</p>
                                        </div>
                                        <button type="button" className="prev-rm" onClick={e => { e.stopPropagation(); removeFile(i) }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Título */}
                    {[
                        { id:'title', label:'Título (opcional)',       type:'text',   val:title,       set:setTitle,       ph:'Mi foto favorita' },
                        { id:'desc',  label:'Descripción (opcional)',  type:'textarea', val:description, set:setDescription, ph:'Cuéntanos algo...' },
                    ].map(f => (
                        <div key={f.id} style={{ position:'relative', marginBottom:f.id==='desc'?32:18 }}>
                            <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:focusField===f.id?'#c9a84c':t.muted, marginBottom:8, fontFamily:'Syne,sans-serif', transition:'color .3s' }}>{f.label}</label>
                            {f.type === 'textarea' ? (
                                <textarea value={f.val} onChange={e => f.set(e.target.value)} onFocus={() => setFocusField(f.id)} onBlur={() => setFocusField('')}
                                          rows={3} placeholder={f.ph}
                                          style={{ width:'100%', padding:'12px 16px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, outline:'none', background:t.inputBg, border:`1px solid ${focusField===f.id?'#c9a84c':t.inputBorder}`, color:t.text, boxShadow:focusField===f.id?'0 0 0 3px rgba(201,168,76,0.15)':'none', resize:'vertical', transition:'border-color .3s,box-shadow .3s' }}
                                />
                            ) : (
                                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} onFocus={() => setFocusField(f.id)} onBlur={() => setFocusField('')}
                                       placeholder={f.ph}
                                       style={{ width:'100%', padding:'12px 16px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, outline:'none', background:t.inputBg, border:`1px solid ${focusField===f.id?'#c9a84c':t.inputBorder}`, color:t.text, boxShadow:focusField===f.id?'0 0 0 3px rgba(201,168,76,0.15)':'none', transition:'border-color .3s,box-shadow .3s,transform .2s' }}
                                />
                            )}
                            <div style={{ position:'absolute', bottom:0, left:0, height:2, background:'#c9a84c', borderRadius:2, transition:'width .35s cubic-bezier(.22,1,.36,1)', width:focusField===f.id?'100%':'0%' }} />
                        </div>
                    ))}

                    {/* Progress */}
                    {loading && (
                        <div style={{ marginBottom:20 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                                <span style={{ color:t.muted, fontSize:13, fontFamily:'Syne,sans-serif' }}>Subiendo...</span>
                                <span style={{ color:'#c9a84c', fontSize:13, fontFamily:'Syne,sans-serif', fontWeight:600 }}>{progress}%</span>
                            </div>
                            <div style={{ height:6, background:t.dark?'#222228':'#d4c8b0', borderRadius:3, overflow:'hidden' }}>
                                <div style={{ height:'100%', background:'linear-gradient(90deg,#c9a84c,#dfc05e)', borderRadius:3, width:`${progress}%`, transition:'width .3s ease' }} />
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div style={{ display:'flex', gap:12 }}>
                        <button type="submit" disabled={loading || !files.length}
                                style={{ flex:1, padding:'14px', background:files.length?'#c9a84c':t.dark?'#222228':'#d4c8b0', color:files.length?'#0a0800':t.muted, border:'none', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', cursor:files.length?'pointer':'not-allowed', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                                onMouseEnter={e => { if(files.length&&!loading){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(201,168,76,.4)'}}}
                                onMouseLeave={e => {e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
                        >
                            {loading ? (
                                <><div style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.3)', borderTop:'2px solid #0a0800', borderRadius:'50%', animation:'spin 1s linear infinite' }} /> Subiendo {progress}%</>
                            ) : `Subir ${files.length ? files.length+' foto'+(files.length>1?'s':'') : 'fotos'}`}
                        </button>
                        <button type="button" onClick={() => navigate('/')}
                                style={{ padding:'14px 24px', background:'transparent', color:t.muted, border:`1px solid ${t.dark?'#2e2e38':'#c8b898'}`, borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, cursor:'pointer', transition:'all .2s' }}
                                onMouseEnter={e => {e.currentTarget.style.borderColor='#c9a84c';e.currentTarget.style.color='#c9a84c'}}
                                onMouseLeave={e => {e.currentTarget.style.borderColor=t.dark?'#2e2e38':'#c8b898';e.currentTarget.style.color=t.muted}}
                        >Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}