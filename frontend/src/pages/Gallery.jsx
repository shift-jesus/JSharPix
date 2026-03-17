import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const QUOTES = [
  { text: 'La fotografía es la historia que no puede ser contada con palabras.', author: 'Elliot Erwitt' },
  { text: 'Una foto dice más que mil palabras, pero solo si sabes mirarla.', author: 'Ansel Adams' },
  { text: 'La luz es la tinta del fotógrafo.', author: 'Eric Kim' },
  { text: 'Fotografiar es apropiarse de lo fotografiado.', author: 'Susan Sontag' },
  { text: 'El mejor momento para tomar una foto siempre es ahora.', author: 'Freeman Patterson' },
  { text: 'Una fotografía no es solo una imagen, es una emoción capturada.', author: 'Steve McCurry' },
  { text: 'La cámara es un instrumento que enseña a la gente a ver sin cámara.', author: 'Dorothea Lange' },
  { text: 'En fotografía hay una realidad tan sutil que se vuelve más real que la realidad.', author: 'Alfred Stieglitz' },
]

const DEFAULT_BGSURL = [
  { id:'default', label:'Oscuro', value:'#080809' },
  { id:'warm',    label:'Cálido', value:'#0f0c08' },
  { id:'deep',    label:'Profundo', value:'#08090f' },
  { id:'forest',  label:'Bosque', value:'#080f09' },
  { id:'wine',    label:'Vino', value:'#0f0809' },
]

function FullscreenModal({ photos, index, onClose, onNext, onPrev }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key==='Escape') onClose()
      if (e.key==='ArrowRight') onNext()
      if (e.key==='ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const photo = photos[index]
  if (!photo) return null

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.96)', display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn .2s ease' }}
      onClick={onClose}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position:'relative', maxWidth:'90vw', maxHeight:'90vh', animation:'scaleIn .25s ease' }} onClick={e => e.stopPropagation()}>
        <img src={`http://localhost:5000/api/photos/file/${photo.filename}`} alt={photo.title}
    style={{ maxWidth:'90vw', maxHeight:'82vh', objectFit:'contain', borderRadius:12, display:'block' }} />
<div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 24px', background:'linear-gradient(to top,rgba(0,0,0,.85),transparent)', borderRadius:'0 0 12px 12px' }}>
    <p style={{ color:'#f0efe8', fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:600, margin:0 }}>{photo.title}</p>
    {photo.description && <p style={{ color:'rgba(240,239,232,.6)', fontFamily:'Syne,sans-serif', fontSize:13, margin:'4px 0 0' }}>{photo.description}</p>}
    <p style={{ color:'rgba(240,239,232,.4)', fontFamily:'Syne,sans-serif', fontSize:12, margin:'4px 0 0' }}>
        {new Date(photo.uploaded_at).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}
    </p>
</div>
</div>
{photos.length > 1 && <>
    <button onClick={e => { e.stopPropagation(); onPrev() }}
            style={{ position:'fixed', left:24, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'#f0efe8', width:52, height:52, borderRadius:'50%', fontSize:24, cursor:'pointer', transition:'background .2s', display:'flex', alignItems:'center', justifyContent:'center' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,.3)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.1)'}
    >‹</button>
    <button onClick={e => { e.stopPropagation(); onNext() }}
            style={{ position:'fixed', right:24, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'#f0efe8', width:52, height:52, borderRadius:'50%', fontSize:24, cursor:'pointer', transition:'background .2s', display:'flex', alignItems:'center', justifyContent:'center' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,.3)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.1)'}
    >›</button>
</>}
<button onClick={onClose}
        style={{ position:'fixed', top:24, right:24, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'#f0efe8', width:44, height:44, borderRadius:'50%', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(217,92,92,.4)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.1)'}
>✕</button>
<div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,.5)', color:'rgba(240,239,232,.7)', padding:'6px 16px', borderRadius:20, fontSize:13, fontFamily:'Syne,sans-serif' }}>
    {index+1} / {photos.length}
</div>
<div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, background:'rgba(0,0,0,.5)', padding:'10px 16px', borderRadius:12, backdropFilter:'blur(8px)', maxWidth:'80vw', overflowX:'auto' }}>
    {photos.map((p,i) => (
        <div key={p.id} style={{ width:48, height:36, borderRadius:6, overflow:'hidden', cursor:'pointer', border:`2px solid ${i===index?'#c9a84c':'transparent'}`, opacity:i===index?1:.5, transition:'all .2s', flexShrink:0 }}>
            <img src={`http://localhost:5000/api/photos/file/${p.filename}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
    ))}
</div>
</div>
)
}

function PhotoCard({ photo, index, onOpenFullscreen, onDelete }) {
    const [hovered, setHovered]   = useState(false)
    const [deleting, setDeleting] = useState(false)
    const t     = useTheme()
    const toast = useToast()

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirm('¿Eliminar esta foto?')) return
        setDeleting(true)
        try {
            await api.delete(`/photos/${photo.id}`)
            toast('Foto eliminada correctamente', 'success')
            onDelete(photo.id)
        } catch {
            toast('Error al eliminar la foto', 'error')
            setDeleting(false)
        }
    }

    return (
        <div
            style={{ position:'relative', borderRadius:12, overflow:'hidden', cursor:'pointer',
                transform:hovered?'translateY(-4px) scale(1.01)':'translateY(0) scale(1)',
                boxShadow:hovered?'0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.3)':'0 4px 20px rgba(0,0,0,.3)',
                transition:'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease',
                background:t.dark?'#111114':'#ece6d8',
                animationDelay:`${index*.05}s`, animation:'cardIn .4s ease both',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onOpenFullscreen(index)}
        >
            <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ overflow:'hidden' }}>
                <img src={`http://localhost:5000/api/photos/file/${photo.filename}`} alt={photo.title} loading="lazy"
                     style={{ width:'100%', display:'block', transform:hovered?'scale(1.08)':'scale(1)', transition:'transform .5s cubic-bezier(.22,1,.36,1)' }} />
            </div>
            <div style={{ position:'absolute', inset:0, background:hovered?'linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.3) 50%,transparent 100%)':'linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)', transition:'background .3s ease' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'16px', transform:hovered?'translateY(0)':'translateY(4px)', transition:'transform .3s ease' }}>
                <p style={{ color:'#f0efe8', fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:600, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{photo.title}</p>
                <p style={{ color:'rgba(240,239,232,.6)', fontFamily:'Syne,sans-serif', fontSize:12, margin:'3px 0 0', opacity:hovered?1:0, transition:'opacity .3s ease' }}>
                    {new Date(photo.uploaded_at).toLocaleDateString('es-ES')}
                </p>
            </div>
            <button onClick={handleDelete} disabled={deleting}
                    style={{ position:'absolute', top:10, right:10, background:'rgba(217,92,92,.85)', border:'none', color:'#fff', width:32, height:32, borderRadius:'50%', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:hovered?1:0, transform:hovered?'scale(1)':'scale(.7)', transition:'opacity .2s,transform .2s', backdropFilter:'blur(4px)' }}
            >✕</button>
            <div style={{ position:'absolute', top:10, left:10, background:'rgba(201,168,76,.85)', color:'#0a0800', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6, fontFamily:'Syne,sans-serif', letterSpacing:.5, opacity:hovered?1:0, transform:hovered?'scale(1)':'scale(.8)', transition:'opacity .2s,transform .2s' }}>
                VER
            </div>
        </div>
    )
}

export default function Gallery() {
    const [photos, setPhotos]       = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState('')
    const [fsIndex, setFsIndex]     = useState(null)
    const [bgColor, setBgColor]     = useState(() => localStorage.getItem('jsharpix_bg') || '#080809')
    const [showBgPicker, setShowBgPicker] = useState(false)
    const [customBg, setCustomBg]   = useState(bgColor)
    const t    = useTheme()
    const { user } = useAuth()

    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

    useEffect(() => { fetchPhotos() }, [])

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/photos')
            setPhotos(res.data)
        } catch { setError('Error al cargar las fotos') }
        finally { setLoading(false) }
    }

    const handleDelete    = (id) => setPhotos(p => p.filter(x => x.id !== id))
    const openFs          = (i) => setFsIndex(i)
    const closeFs         = ()  => setFsIndex(null)
    const nextFs          = ()  => setFsIndex(i => (i+1) % photos.length)
    const prevFs          = ()  => setFsIndex(i => (i-1+photos.length) % photos.length)

    const applyBg = (color) => {
        setBgColor(color)
        setCustomBg(color)
        localStorage.setItem('jsharpix_bg', color)
        setShowBgPicker(false)
    }

    const pageBackground = t.dark ? bgColor : t.bg

    return (
        <div style={{ minHeight:'100vh', background:pageBackground, color:t.text, transition:'background .4s, color .4s' }}>
            <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes heroIn  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineExp { from{width:0} to{width:60px} }
        .masonry { columns:4; column-gap:16px; }
        .masonry-item { break-inside:avoid; margin-bottom:16px; }
        @media(max-width:1200px) { .masonry{columns:3} }
        @media(max-width:800px)  { .masonry{columns:2} }
        @media(max-width:500px)  { .masonry{columns:1} }
        .bg-swatch { width:32px; height:32px; border-radius:50%; cursor:pointer; transition:transform .2s,box-shadow .2s; border:2px solid transparent; }
        .bg-swatch:hover { transform:scale(1.15); box-shadow:0 4px 12px rgba(0,0,0,.4); }
      `}</style>

            <Navbar />

            {/* Hero bienvenida */}
            <div style={{ padding:'60px 48px 48px', maxWidth:1400, margin:'0 auto', position:'relative' }}>

                {/* Fondo personalizable — botón */}
                <div style={{ position:'absolute', top:24, right:48, zIndex:10 }}>
                    <button onClick={() => setShowBgPicker(!showBgPicker)}
                            style={{ background:'rgba(201,168,76,.12)', border:'1px solid rgba(201,168,76,.3)', color:'#c9a84c', padding:'7px 14px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', gap:6 }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(201,168,76,.2)'; e.currentTarget.style.borderColor='#c9a84c' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(201,168,76,.12)'; e.currentTarget.style.borderColor='rgba(201,168,76,.3)' }}
                    >🎨 Fondo</button>

                    {showBgPicker && (
                        <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, background:t.dark?'#18181d':'#f2ede4', border:`1px solid ${t.dark?'#2e2e38':'#d4c8b0'}`, borderRadius:14, padding:20, minWidth:240, boxShadow:'0 16px 48px rgba(0,0,0,.4)', zIndex:200, animation:'fadeIn .2s ease' }}>
                            <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>Fondos predefinidos</p>
                            <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
                                {DEFAULT_BGSURL.map(bg => (
                                    <div key={bg.id} style={{ textAlign:'center' }}>
                                        <div className="bg-swatch"
                                             style={{ background:bg.value, border:`2px solid ${bgColor===bg.value?'#c9a84c':'transparent'}`, boxShadow:bgColor===bg.value?'0 0 0 1px #c9a84c':'none' }}
                                             onClick={() => applyBg(bg.value)}
                                        />
                                        <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:10, margin:'4px 0 0' }}>{bg.label}</p>
                                    </div>
                                ))}
                            </div>
                            <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Color personalizado</p>
                            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                                <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)}
                                       style={{ width:40, height:36, border:'none', borderRadius:8, cursor:'pointer', background:'transparent' }} />
                                <input type="text" value={customBg} onChange={e => setCustomBg(e.target.value)}
                                       style={{ flex:1, background:t.dark?'#111114':'#ece6d8', border:`1px solid ${t.dark?'#2e2e38':'#c8b898'}`, color:t.text, padding:'8px 12px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, outline:'none' }}
                                       placeholder="#080809"
                                />
                                <button onClick={() => applyBg(customBg)}
                                        style={{ padding:'8px 14px', background:'#c9a84c', color:'#0a0800', border:'none', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Texto hero */}
                <div style={{ animation:'heroIn .7s ease both' }}>
                    <p style={{ fontSize:12, letterSpacing:3, textTransform:'uppercase', color:'rgba(201,168,76,.7)', marginBottom:16, fontFamily:'Syne,sans-serif', fontWeight:600 }}>
                        {greeting} · Tu biblioteca visual privada
                    </p>
                    <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,5vw,72px)', fontWeight:700, lineHeight:1.05, margin:'0 0 8px', color:t.text, maxWidth:700 }}>
                        Hola de nuevo,{' '}
                        <span style={{ color:'#c9a84c', display:'inline-block' }}>{user?.alias || user?.username}</span>
                    </h1>
                    <div style={{ width:0, height:2, background:'#c9a84c', borderRadius:2, animation:'lineExp .8s .4s ease both', marginBottom:24 }} />
                    <p style={{ color:t.muted, fontFamily:'Playfair Display,serif', fontSize:'clamp(14px,1.5vw,18px)', fontStyle:'italic', lineHeight:1.7, maxWidth:560, margin:'0 0 4px' }}>
                        "{quote.text}"
                    </p>
                    <p style={{ color:'rgba(201,168,76,.6)', fontFamily:'Syne,sans-serif', fontSize:13, margin:0 }}>— {quote.author}</p>
                </div>
            </div>

            {/* Galería */}
            <div style={{ padding:'0 48px 60px', maxWidth:1400, margin:'0 auto' }}>

                {/* Subheader */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, animation:'fadeUp .5s .2s ease both' }}>
                    <div>
                        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700, color:t.text, margin:0 }}>Mi galería</h2>
                        <p style={{ color:t.muted, fontSize:13, margin:'4px 0 0', fontFamily:'Syne,sans-serif' }}>
                            {photos.length} foto{photos.length!==1?'s':''} en tu biblioteca
                        </p>
                    </div>
                    <Link to="/upload"
                          style={{ background:'#c9a84c', color:'#0a0800', padding:'11px 26px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, letterSpacing:.5, textTransform:'uppercase', textDecoration:'none', transition:'transform .2s,box-shadow .2s', display:'inline-block' }}
                          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(201,168,76,.4)' }}
                          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
                    >+ Subir fotos</Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:300 }}>
                        <div style={{ width:48, height:48, border:'3px solid rgba(201,168,76,.2)', borderTop:'3px solid #c9a84c', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    </div>
                )}

                {error && <div style={{ padding:'13px 18px', background:'rgba(217,92,92,.08)', color:'#d95c5c', border:'1px solid rgba(217,92,92,.3)', borderRadius:8, fontSize:13 }}>{error}</div>}

                {/* Empty state */}
                {!loading && photos.length === 0 && (
                    <div style={{ textAlign:'center', padding:'100px 20px', animation:'fadeUp .5s ease both' }}>
                        <div style={{ fontSize:72, marginBottom:24, opacity:.35 }}>🖼️</div>
                        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:t.text, marginBottom:12 }}>Tu galería está vacía</h2>
                        <p style={{ color:t.muted, fontSize:15, marginBottom:32, maxWidth:360, margin:'0 auto 32px', lineHeight:1.8 }}>
                            Sube tu primera fotografía y empieza a construir tu biblioteca visual privada.
                        </p>
                        <Link to="/upload" style={{ background:'#c9a84c', color:'#0a0800', padding:'14px 32px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', textDecoration:'none' }}>
                            Subir primera foto
                        </Link>
                    </div>
                )}

                {/* Masonry */}
                {!loading && photos.length > 0 && (
                    <div className="masonry">
                        {photos.map((photo, i) => (
                            <div key={photo.id} className="masonry-item">
                                <PhotoCard photo={photo} index={i} onOpenFullscreen={openFs} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {fsIndex !== null && (
                <FullscreenModal photos={photos} index={fsIndex} onClose={closeFs} onNext={nextFs} onPrev={prevFs} />
            )}

            {/* Cerrar picker al click fuera */}
            {showBgPicker && <div style={{ position:'fixed', inset:0, zIndex:100 }} onClick={() => setShowBgPicker(false)} />}
        </div>
    )
}
