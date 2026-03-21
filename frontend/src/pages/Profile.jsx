import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'
import ShareCard from '../components/ShareCard'

const LAYOUT_PREVIEWS = {
    masonry: (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, width:48, height:36 }}>
            {[28,20,32,24,28,20].map((h,i) => <div key={i} style={{ background:'rgba(201,168,76,0.6)', borderRadius:2, height:h }} />)}
        </div>
    ),
    grid: (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, width:48, height:36 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ background:'rgba(201,168,76,0.6)', borderRadius:2 }} />)}
        </div>
    ),
    slider: (
        <div style={{ display:'flex', gap:2, width:48, height:36, alignItems:'center' }}>
            <div style={{ width:6, background:'rgba(201,168,76,0.3)', borderRadius:2, height:'100%' }} />
            <div style={{ flex:1, background:'rgba(201,168,76,0.8)', borderRadius:2, height:'100%' }} />
            <div style={{ width:6, background:'rgba(201,168,76,0.3)', borderRadius:2, height:'100%' }} />
        </div>
    ),
}

export default function Profile() {
    const { user, checkAuth } = useAuth()
    const t         = useTheme()
    const toast     = useToast()
    const navigate  = useNavigate()
    const avatarRef = useRef()
    const bannerRef = useRef()

    const [editing, setEditing]             = useState(false)
    const [saveState, setSaveState]         = useState('idle')
    const [photos, setPhotos]               = useState([])
    const [focusField, setFocus]            = useState('')
    const [loaded, setLoaded]               = useState(false)
    const [showShareCard, setShowShareCard] = useState(false)
    const [codeCopied, setCodeCopied]       = useState(false)

    const [form, setForm] = useState({
        alias:'', bio:'', location:'', website:'', gear_location:'', layout:'masonry',
    })

    useEffect(() => {
        if (user) {
            setForm({
                alias:         user.alias || '',
                bio:           user.bio || '',
                location:      user.location || '',
                website:       user.website || '',
                gear_location: user.gear_location || '',
                layout:        user.layout || 'masonry',
            })
        }
        fetchPhotos()
        setTimeout(() => setLoaded(true), 100)
    }, [user])

    const fetchPhotos = async () => {
        try { const res = await api.get('/photos'); setPhotos(res.data) } catch {}
    }

    const handleSave = async () => {
        setSaveState('loading')
        try {
            await api.put('/auth/profile', form)
            await checkAuth()
            localStorage.setItem('jsharpix_layout', form.layout)
            setSaveState('success')
            toast('Perfil actualizado correctamente', 'success')
            setTimeout(() => { setSaveState('idle'); setEditing(false) }, 1500)
        } catch {
            setSaveState('idle')
            toast('Error al actualizar el perfil', 'error')
        }
    }

    const handleAvatar = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fd = new FormData()
        fd.append('avatar', file)
        try {
            await api.post('/photos/avatar', fd, { headers:{ 'Content-Type':'multipart/form-data' } })
            await checkAuth()
            toast('Avatar actualizado', 'success')
        } catch { toast('Error al subir avatar', 'error') }
    }

    const handleBanner = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fd = new FormData()
        fd.append('banner', file)
        try {
            await api.post('/photos/banner', fd, { headers:{ 'Content-Type':'multipart/form-data' } })
            await checkAuth()
            toast('Banner actualizado', 'success')
        } catch { toast('Error al subir banner', 'error') }
    }

    const copyFriendCode = () => {
        navigator.clipboard.writeText(user.friend_code)
        setCodeCopied(true)
        toast('Código copiado', 'success')
        setTimeout(() => setCodeCopied(false), 2000)
    }

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const cardBg     = t.dark ? '#111114' : '#ece6d8'
    const cardBorder = t.dark ? '#222228' : '#d4c8b0'

    if (!user) return null

    const avatarUrl    = user.avatar ? 'http://localhost:5000/api/photos/file/' + user.avatar : null
    const bannerUrl    = user.banner ? 'http://localhost:5000/api/photos/file/' + user.banner : null
    const websiteUrl   = user.website ? (user.website.indexOf('http') === 0 ? user.website : 'https://' + user.website) : null
    const websiteLabel = user.website ? user.website.replace('https://','').replace('http://','') : ''

    return (
        <div style={{ minHeight:'100vh', background:t.bg, color:t.text, transition:'background .4s, color .4s' }}>
            <style>{`
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes bannerIn     { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        @keyframes avatarBounce { 0%{opacity:0;transform:translateY(20px) scale(.8)} 60%{transform:translateY(-6px) scale(1.05)} 80%{transform:translateY(2px) scale(.98)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cascadeIn    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkPop     { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .p-input { width:100%; padding:11px 14px; border-radius:8px; font-family:'Syne',sans-serif; font-size:14px; outline:none; transition:border-color .3s,box-shadow .3s,transform .2s; box-sizing:border-box; }
        .p-input:focus { transform:translateY(-1px); }
        .layout-btn { padding:10px 0; border-radius:10px; font-family:'Syne',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .3s; display:flex; flex-direction:column; align-items:center; gap:8px; flex:1; border:none; }
        .photo-sm { position:relative; border-radius:10px; overflow:hidden; aspect-ratio:1; cursor:pointer; }
        .photo-sm img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .3s,filter .3s; }
        .photo-sm:hover img { transform:scale(1.08); filter:brightness(.75); }
        .photo-sm-overlay { position:absolute; inset:0; display:flex; align-items:flex-end; padding:8px; opacity:0; transition:opacity .3s; }
        .photo-sm:hover .photo-sm-overlay { opacity:1; }
        .banner-wrap { position:relative; overflow:hidden; cursor:pointer; }
        .banner-ovh { position:absolute; inset:0; background:rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .25s; }
        .banner-wrap:hover .banner-ovh { opacity:1; }
        .save-btn { width:100%; padding:14px; border:none; border-radius:8px; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:transform .2s,box-shadow .2s; }
        .save-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(201,168,76,.4); }
      `}</style>

            <Navbar />

            {/* Banner */}
            <div className="banner-wrap"
                 style={{ height:240, background:bannerUrl ? 'transparent' : 'linear-gradient(135deg,#1a1410,#2a2018)', animation:loaded ? 'bannerIn .6s ease both' : '' }}
                 onClick={() => bannerRef.current && bannerRef.current.click()}
            >
                {bannerUrl && <img src={bannerUrl} alt="banner" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />}
                {!bannerUrl && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                        <p style={{ color:'rgba(201,168,76,0.12)', fontFamily:'Playfair Display,serif', fontSize:90, fontWeight:700, margin:0 }}>JSharPix</p>
                    </div>
                )}
                <div className="banner-ovh">
                    <span style={{ color:'#f0efe8', fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:600, background:'rgba(0,0,0,.6)', padding:'10px 24px', borderRadius:8 }}>Cambiar banner</span>
                </div>
                <input ref={bannerRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleBanner} />
            </div>

            <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 40px 80px' }}>

                {/* Header */}
                <div style={{ marginTop:-52, marginBottom:40, position:'relative', zIndex:10 }}>

                    {/* Fila 1: avatar + info + stats */}
                    <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:20, flexWrap:'wrap' }}>

                        {/* Avatar */}
                        <div
                            style={{ position:'relative', cursor:'pointer', flexShrink:0, animation:loaded ? 'avatarBounce .7s .2s cubic-bezier(.22,1,.36,1) both' : '' }}
                            onClick={() => avatarRef.current && avatarRef.current.click()}
                        >
                            <div
                                style={{ width:108, height:108, borderRadius:'50%', border:'5px solid ' + t.bg, background:'linear-gradient(135deg,#c9a84c,#a07c30)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,.5)', transition:'transform .2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {avatarUrl
                                    ? <img src={avatarUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                    : <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:44, color:'#0a0800' }}>{user.username[0].toUpperCase()}</span>
                                }
                            </div>
                            <div style={{ position:'absolute', bottom:4, right:4, background:'#c9a84c', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, border:'3px solid ' + t.bg }}>✎</div>
                            <input ref={avatarRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatar} />
                        </div>

                        {/* Info */}
                        <div style={{ flex:1, minWidth:200, animation:loaded ? 'cascadeIn .5s .4s ease both' : '' }}>
                            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, margin:'0 0 4px', color:t.text, lineHeight:1.1 }}>
                                {user.alias || user.username}
                            </h1>
                            <p style={{ color:'rgba(201,168,76,.7)', fontFamily:'Syne,sans-serif', fontSize:13, margin:'0 0 10px', fontWeight:500 }}>@{user.username}</p>
                            {user.bio && <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:13, margin:'0 0 10px', lineHeight:1.7, maxWidth:400 }}>{user.bio}</p>}
                            <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
                                {user.location && (
                                    <span style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ color:'#c9a84c' }}>📍</span> {user.location}
                  </span>
                                )}
                                {websiteUrl && (
                                    <a href={websiteUrl} target="_blank" rel="noreferrer"
                                       style={{ color:'#c9a84c', fontFamily:'Syne,sans-serif', fontSize:12, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                                       onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
                                       onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        <span>🔗</span> {websiteLabel}
                                    </a>
                                )}
                                {user.gear_location && (
                                    <span style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ color:'#c9a84c' }}>🏙️</span> {user.gear_location}
                  </span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display:'flex', gap:0, animation:loaded ? 'cascadeIn .5s .5s ease both' : '', background:t.dark ? '#111114' : '#ece6d8', border:'1px solid ' + cardBorder, borderRadius:12, overflow:'hidden' }}>
                            <div style={{ textAlign:'center', padding:'16px 28px' }}>
                                <p style={{ color:'#c9a84c', fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, margin:0, lineHeight:1 }}>{photos.length}</p>
                                <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:10, margin:'5px 0 0', letterSpacing:1.5, textTransform:'uppercase' }}>Fotos</p>
                            </div>
                            <div style={{ width:1, background:cardBorder }} />
                            <div style={{ textAlign:'center', padding:'16px 28px' }}>
                                <p style={{ color:t.text, fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, margin:0, lineHeight:1 }}>
                                    {new Date(user.created_at).toLocaleDateString('es-ES', { month:'short', year:'numeric' })}
                                </p>
                                <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:10, margin:'5px 0 0', letterSpacing:1.5, textTransform:'uppercase' }}>Miembro desde</p>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: botones */}
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', borderTop:'1px solid ' + cardBorder, paddingTop:20, animation:loaded ? 'cascadeIn .5s .6s ease both' : '' }}>

                        <button
                            onClick={() => setShowShareCard(true)}
                            style={{ padding:'10px 22px', background:'transparent', color:'#c9a84c', border:'1px solid rgba(201,168,76,.4)', borderRadius:10, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .25s', letterSpacing:.5, display:'flex', alignItems:'center', gap:8 }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.1)'; e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,.2)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                        >✦ Compartir perfil</button>

                        <button
                            onClick={() => setEditing(!editing)}
                            style={{ padding:'10px 22px', background:editing ? 'transparent' : '#c9a84c', color:editing ? t.muted : '#0a0800', border:editing ? '1px solid ' + cardBorder : 'none', borderRadius:10, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .25s', letterSpacing:.5, display:'flex', alignItems:'center', gap:8 }}
                            onMouseEnter={e => { if (!editing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,.35)' } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                        >{editing ? '✕ Cancelar' : '✎ Editar perfil'}</button>

                        <div style={{ flex:1 }} />

                        {/* Código de acceso */}
                        <div style={{ display:'flex', alignItems:'center', gap:12, background:t.dark ? '#111114' : '#ece6d8', border:'1px solid ' + cardBorder, borderRadius:10, padding:'10px 16px' }}>
                            <div>
                                <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:10, margin:0, letterSpacing:1.5, textTransform:'uppercase' }}>Código de acceso</p>
                                <p style={{ color:'#c9a84c', fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, margin:'2px 0 0', letterSpacing:2 }}>{user.friend_code}</p>
                            </div>
                            <button
                                onClick={copyFriendCode}
                                style={{ background:codeCopied ? 'rgba(76,175,130,.2)' : 'rgba(201,168,76,.1)', border:'1px solid ' + (codeCopied ? 'rgba(76,175,130,.4)' : 'rgba(201,168,76,.2)'), color:codeCopied ? '#4caf82' : '#c9a84c', width:34, height:34, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, transition:'all .2s' }}
                                title="Copiar código"
                            >{codeCopied ? '✓' : '📋'}</button>
                        </div>
                    </div>
                </div>

                {/* Grid edición + panel derecho */}
                <div style={{ display:'grid', gridTemplateColumns:editing ? '1fr 1fr' : '1fr', gap:24 }}>

                    {/* Panel edición */}
                    {editing && (
                        <div style={{ background:cardBg, border:'1px solid ' + cardBorder, borderRadius:16, padding:32, animation:'cascadeIn .35s ease both' }}>
                            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, marginBottom:28, color:t.text }}>Editar perfil</h2>

                            {[
                                { key:'alias',    label:'Alias artístico',  ph:'Luz de Luna',             ta:false, icon:null },
                                { key:'bio',      label:'Biografía',        ph:'Fotógrafo apasionado...',  ta:true,  icon:null },
                                { key:'location', label:'Ubicación',        ph:'Madrid, España',           ta:false, icon:'📍' },
                                { key:'website',  label:'Sitio web',        ph:'https://miweb.com',        ta:false, icon:'🔗' },
                            ].map(f => (
                                <div key={f.key} style={{ marginBottom:20, position:'relative' }}>
                                    <label style={{ display:'block', fontSize:12, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:focusField===f.key ? '#c9a84c' : t.text, marginBottom:8, fontFamily:'Syne,sans-serif', transition:'color .3s' }}>{f.label}</label>
                                    <div style={{ position:'relative' }}>
                                        {f.icon && <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none', zIndex:1 }}>{f.icon}</span>}
                                        {f.ta
                                            ? <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} onFocus={() => setFocus(f.key)} onBlur={() => setFocus('')} rows={3} placeholder={f.ph} className="p-input"
                                                        style={{ background:t.inputBg, border:'1px solid ' + (focusField===f.key ? '#c9a84c' : t.inputBorder), color:t.text, resize:'vertical', boxShadow:focusField===f.key ? '0 0 0 3px rgba(201,168,76,.15)' : 'none' }} />
                                            : <input type="text" value={form[f.key]} onChange={e => set(f.key, e.target.value)} onFocus={() => setFocus(f.key)} onBlur={() => setFocus('')} placeholder={f.ph} className="p-input"
                                                     style={{ background:t.inputBg, border:'1px solid ' + (focusField===f.key ? '#c9a84c' : t.inputBorder), color:t.text, boxShadow:focusField===f.key ? '0 0 0 3px rgba(201,168,76,.15)' : 'none', paddingLeft:f.icon ? '38px' : '14px' }} />
                                        }
                                    </div>
                                    <div style={{ position:'absolute', bottom:0, left:0, height:2, background:'#c9a84c', borderRadius:2, transition:'width .35s cubic-bezier(.22,1,.36,1)', width:focusField===f.key ? '100%' : '0%' }} />
                                </div>
                            ))}

                            {/* Ciudad */}
                            <div style={{ marginBottom:24, position:'relative' }}>
                                <label style={{ display:'block', fontSize:12, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:focusField==='gear_location' ? '#c9a84c' : t.text, marginBottom:8, fontFamily:'Syne,sans-serif', transition:'color .3s' }}>Ciudad</label>
                                <div style={{ position:'relative' }}>
                                    <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none', zIndex:1 }}>🏙️</span>
                                    <input type="text" value={form.gear_location} onChange={e => set('gear_location', e.target.value)} onFocus={() => setFocus('gear_location')} onBlur={() => setFocus('')} placeholder="Cartagena, Colombia" className="p-input"
                                           style={{ background:t.inputBg, border:'1px solid ' + (focusField==='gear_location' ? '#c9a84c' : t.inputBorder), color:t.text, paddingLeft:'38px', boxShadow:focusField==='gear_location' ? '0 0 0 3px rgba(201,168,76,.15)' : 'none' }} />
                                </div>
                                <div style={{ position:'absolute', bottom:0, left:0, height:2, background:'#c9a84c', borderRadius:2, transition:'width .35s cubic-bezier(.22,1,.36,1)', width:focusField==='gear_location' ? '100%' : '0%' }} />
                            </div>

                            {/* Layout */}
                            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', color:t.text, marginBottom:14 }}>Layout de galería</h3>
                            <div style={{ display:'flex', gap:10, marginBottom:28 }}>
                                {[
                                    { val:'masonry', label:'Masonry' },
                                    { val:'grid',    label:'Grid'    },
                                    { val:'slider',  label:'Slider'  },
                                ].map(l => (
                                    <button key={l.val} className="layout-btn" onClick={() => set('layout', l.val)}
                                            style={{ background:form.layout===l.val ? 'rgba(201,168,76,.12)' : 'transparent', color:form.layout===l.val ? '#c9a84c' : t.muted, border:'1px solid ' + (form.layout===l.val ? '#c9a84c' : cardBorder), padding:'12px 0' }}>
                                        <div style={{ transition:'transform .3s', transform:form.layout===l.val ? 'scale(1.1)' : 'scale(1)' }}>
                                            {LAYOUT_PREVIEWS[l.val]}
                                        </div>
                                        <span style={{ fontSize:11 }}>{l.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Guardar */}
                            <button className="save-btn" onClick={handleSave} disabled={saveState !== 'idle'}
                                    style={{ background:saveState==='success' ? '#4caf82' : '#c9a84c', color:'#0a0800' }}>
                                {saveState === 'idle' && '✓ Guardar cambios'}
                                {saveState === 'loading' && (
                                    <><div style={{ width:16, height:16, border:'2px solid rgba(0,0,0,.3)', borderTop:'2px solid #0a0800', borderRadius:'50%', animation:'spin 1s linear infinite' }} /> Guardando...</>
                                )}
                                {saveState === 'success' && <span style={{ animation:'checkPop .4s ease both', fontSize:18 }}>✓ Guardado!</span>}
                            </button>
                        </div>
                    )}

                    {/* Panel derecho */}
                    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

                        {user.gear_location && (
                            <div style={{ background:cardBg, border:'1px solid ' + cardBorder, borderRadius:16, padding:20, animation:'cascadeIn .5s .3s ease both', display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:24 }}>🏙️</span>
                                <div>
                                    <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:11, margin:0, textTransform:'uppercase', letterSpacing:.5 }}>Ciudad</p>
                                    <p style={{ color:t.text, fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:600, margin:'3px 0 0' }}>{user.gear_location}</p>
                                </div>
                            </div>
                        )}

                        {photos.length > 0 && (
                            <div style={{ background:cardBg, border:'1px solid ' + cardBorder, borderRadius:16, padding:24, animation:'cascadeIn .5s .5s ease both' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                                    <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', color:t.muted, margin:0 }}>Fotos recientes</h3>
                                    <button onClick={() => navigate('/')} style={{ background:'transparent', border:'none', color:'#c9a84c', fontFamily:'Syne,sans-serif', fontSize:12, cursor:'pointer', fontWeight:600 }}>Ver todas →</button>
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                                    {photos.slice(0,9).map((p,i) => (
                                        <div key={p.id} className="photo-sm" onClick={() => navigate('/')}
                                             style={{ animation:'cascadeIn .4s ' + (.1+i*.06) + 's ease both' }}>
                                            <img src={'http://localhost:5000/api/photos/file/' + p.filename} alt={p.title} />
                                            <div className="photo-sm-overlay">
                                                <span style={{ color:'#f0efe8', fontFamily:'Syne,sans-serif', fontSize:11, fontWeight:600, background:'rgba(0,0,0,.5)', padding:'3px 8px', borderRadius:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>{p.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {photos.length === 0 && !editing && (
                            <div style={{ background:cardBg, border:'1px solid ' + cardBorder, borderRadius:16, padding:52, textAlign:'center', animation:'cascadeIn .5s .3s ease both' }}>
                                <div style={{ fontSize:52, marginBottom:16, opacity:.35 }}>✨</div>
                                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:t.text, marginBottom:10 }}>Personaliza tu perfil</h3>
                                <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:14, lineHeight:1.8, maxWidth:300, margin:'0 auto 28px' }}>Agrega tu alias artístico y sube tu primera foto.</p>
                                <button onClick={() => setEditing(true)}
                                        style={{ padding:'13px 32px', background:'#c9a84c', color:'#0a0800', border:'none', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                                    Completar perfil
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showShareCard && <ShareCard user={user} onClose={() => setShowShareCard(false)} />}
        </div>
    )
}