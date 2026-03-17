import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const FEATURES = [
    { icon:'🖼️', title:'Biblioteca privada',  desc:'Cada usuario tiene su propio espacio privado. Nadie más puede ver tus fotos.' },
    { icon:'📁', title:'Organización',         desc:'Organiza tus fotos con títulos y descripciones para encontrarlas fácilmente.' },
    { icon:'⚡', title:'Subida rápida',         desc:'Sube múltiples fotos a la vez. Formatos PNG, JPG, GIF y WEBP.' },
    { icon:'🔒', title:'Seguridad total',       desc:'Tus imágenes solo son accesibles para ti. Protección total de privacidad.' },
    { icon:'🎨', title:'Alta calidad',          desc:'Almacena tus fotografías en su resolución original sin compresión.' },
    { icon:'📱', title:'Responsive',            desc:'Accede a tu galería desde cualquier dispositivo, en cualquier lugar.' },
]

const SLIDER_PHOTOS = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80',
    'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=600&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80',
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80',
    'https://images.unsplash.com/photo-1501492673258-2af8d3be1b8b?w=600&q=80',
    'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=600&q=80',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&q=80',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80',
]

export default function Guest() {
    const t = useTheme()
    const [current, setCurrent] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const timerRef = useRef(null)
    const total = SLIDER_PHOTOS.length

    const next = () => setCurrent(c => (c + 1) % total)
    const prev = () => setCurrent(c => (c - 1 + total) % total)

    useEffect(() => {
        timerRef.current = setInterval(next, 3500)
        return () => clearInterval(timerRef.current)
    }, [])

    const resetTimer = () => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(next, 3500)
    }

    const goTo = (i) => { setCurrent(i); resetTimer() }
    const handlePrev = () => { prev(); resetTimer() }
    const handleNext = () => { next(); resetTimer() }

    const onMouseDown = (e) => { setDragging(true); setStartX(e.clientX) }
    const onMouseUp   = (e) => {
        if (!dragging) return
        setDragging(false)
        const diff = e.clientX - startX
        if (diff > 50) { prev(); resetTimer() }
        else if (diff < -50) { next(); resetTimer() }
    }

    const navBg      = t.dark ? 'rgba(8,8,9,0.85)'   : 'rgba(242,237,228,0.95)'
    const navBorder  = t.dark ? '#222228'             : '#d4c8b0'
    const cardBg     = t.dark ? '#111114'             : '#ece6d8'
    const cardBorder = t.dark ? '#222228'             : '#d4c8b0'
    const sectionBg  = t.dark ? '#0c0c0f'             : '#e8e2d8'

    return (
        <div style={{ minHeight:'100vh', background:t.bg, color:t.text, fontFamily:'Syne,sans-serif', transition:'background .4s, color .4s' }}>
            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes goldGlow { 0%,100%{text-shadow:0 0 40px rgba(201,168,76,.35)} 50%{text-shadow:0 0 90px rgba(201,168,76,.8)} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.75} }
        .g-card { border-radius:14px; padding:28px 24px; transition:transform .25s,border-color .25s,box-shadow .25s; cursor:default; }
        .g-card:hover { transform:translateY(-5px); box-shadow:0 12px 40px rgba(201,168,76,.08); }
        .g-cta { background:#c9a84c; color:#0a0800; border:none; padding:16px 40px; border-radius:8px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:none; display:inline-block; cursor:pointer; position:relative; overflow:hidden; transition:transform .2s,box-shadow .2s; }
        .g-cta:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(201,168,76,.45); }
        .g-cta::after { content:''; position:absolute; border-radius:50%; background:rgba(255,255,255,.2); top:50%; left:50%; width:0; height:0; transform:translate(-50%,-50%); transition:width .55s,height .55s,opacity .55s; opacity:.4; }
        .g-cta:hover::after { width:400px; height:400px; opacity:0; }
        .s-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); border:1px solid rgba(201,168,76,.3); color:#c9a84c; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:20px; z-index:10; transition:background .2s,border-color .2s; user-select:none; border:none; }
        .s-arrow:hover { background:rgba(201,168,76,.2); }
        .s-dot { width:8px; height:8px; border-radius:50%; cursor:pointer; transition:background .3s,transform .3s; }
        .g-nav-btn { background:transparent; border-radius:8px; font-family:'Syne',sans-serif; text-decoration:none; display:inline-block; transition:border-color .25s,color .25s; padding:8px 24px; font-size:13px; }
      `}</style>

            {/* Navbar */}
            <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 48px', height:64, background:navBg, backdropFilter:'blur(12px)', borderBottom:`1px solid ${navBorder}`, position:'sticky', top:0, zIndex:100, transition:'background .4s' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
                    <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:24, color:'#c9a84c' }}>J</span>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:16, letterSpacing:3, textTransform:'uppercase', color:t.text }}>SHARPIX</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                    <ThemeToggle />
                    <Link to="/login" className="g-nav-btn"
                          style={{ border:`1px solid ${t.dark?'rgba(240,239,232,.25)':'rgba(26,20,16,.3)'}`, color:t.text }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#c9a84c' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=t.dark?'rgba(240,239,232,.25)':'rgba(26,20,16,.3)'; e.currentTarget.style.color=t.text }}
                    >Iniciar sesión</Link>
                    <Link to="/register" className="g-cta" style={{ padding:'8px 24px', fontSize:13 }}>Crear cuenta</Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign:'center', padding:'100px 48px 80px', animation:'fadeUp .8s both' }}>
                <p style={{ fontSize:12, letterSpacing:3, textTransform:'uppercase', color:'#c9a84c', marginBottom:24, fontWeight:600 }}>Tu biblioteca visual privada</p>
                <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(48px,7vw,88px)', fontWeight:700, lineHeight:1.1, marginBottom:28, maxWidth:800, margin:'0 auto 28px', color:t.text }}>
                    Donde cada{' '}
                    <span style={{ color:'#c9a84c', animation:'goldGlow 3s ease-in-out infinite', display:'inline-block' }}>fotografía</span>
                    {' '}tiene su lugar
                </h1>
                <p style={{ fontSize:18, color:t.muted, maxWidth:520, margin:'0 auto 48px', lineHeight:1.8 }}>
                    JSharPix es una plataforma digital para organizar, explorar y compartir imágenes de alta calidad de forma completamente privada.
                </p>
                <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                    <Link to="/register" className="g-cta">Empezar gratis</Link>
                    <Link to="/login" style={{ padding:'16px 40px', borderRadius:8, border:`1px solid ${t.dark?'rgba(240,239,232,.25)':'rgba(26,20,16,.3)'}`, color:t.text, textDecoration:'none', fontFamily:'Syne,sans-serif', fontSize:15, transition:'border-color .25s,color .25s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#c9a84c' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=t.dark?'rgba(240,239,232,.25)':'rgba(26,20,16,.3)'; e.currentTarget.style.color=t.text }}
                    >Ya tengo cuenta</Link>
                </div>
            </section>

            {/* Slider */}
            <section style={{ padding:'0 48px 80px', maxWidth:1200, margin:'0 auto' }}>
                <p style={{ fontSize:12, letterSpacing:3, textTransform:'uppercase', color:'#c9a84c', marginBottom:16, fontWeight:600, textAlign:'center' }}>Galería de ejemplo</p>
                <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3vw,36px)', textAlign:'center', marginBottom:40, color:t.text }}>Imágenes de alta calidad</h2>

                <div style={{ position:'relative', borderRadius:16, overflow:'hidden', userSelect:'none' }}
                     onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={() => setDragging(false)}>
                    <div style={{ position:'relative', aspectRatio:'16/7', overflow:'hidden', borderRadius:16 }}>
                        {SLIDER_PHOTOS.map((src,i) => (
                            <div key={i} style={{ position:'absolute', inset:0, opacity:i===current?1:0, transition:'opacity .6s ease', pointerEvents:i===current?'auto':'none' }}>
                                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                            </div>
                        ))}
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 50%)', pointerEvents:'none' }} />
                        <div style={{ position:'absolute', top:16, right:16, background:'rgba(0,0,0,0.5)', color:'#f0efe8', fontSize:12, padding:'4px 12px', borderRadius:20, fontFamily:'Syne,sans-serif', letterSpacing:1 }}>
                            {current+1} / {total}
                        </div>
                    </div>
                    <button className="s-arrow" style={{ left:16, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(201,168,76,.3)', color:'#c9a84c' }} onClick={handlePrev}>‹</button>
                    <button className="s-arrow" style={{ right:16, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(201,168,76,.3)', color:'#c9a84c' }} onClick={handleNext}>›</button>
                </div>

                {/* Dots */}
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
                    {SLIDER_PHOTOS.map((_,i) => (
                        <div key={i} className="s-dot" onClick={() => goTo(i)}
                             style={{ background:i===current?'#c9a84c':t.dark?'rgba(240,239,232,.25)':'rgba(26,20,16,.2)', transform:i===current?'scale(1.3)':'scale(1)' }}
                        />
                    ))}
                </div>

                {/* Thumbnails */}
                <div style={{ display:'flex', gap:10, marginTop:20, overflowX:'auto', paddingBottom:8 }}>
                    {SLIDER_PHOTOS.map((src,i) => (
                        <div key={i} onClick={() => goTo(i)} style={{ flexShrink:0, width:80, height:56, borderRadius:8, overflow:'hidden', cursor:'pointer', border:`2px solid ${i===current?'#c9a84c':'transparent'}`, opacity:i===current?1:0.55, transition:'opacity .2s,border-color .2s' }}>
                            <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ padding:'80px 48px', background:sectionBg, transition:'background .4s' }}>
                <p style={{ textAlign:'center', fontSize:12, letterSpacing:3, textTransform:'uppercase', color:'#c9a84c', marginBottom:16, fontWeight:600 }}>Funcionalidades</p>
                <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,42px)', textAlign:'center', marginBottom:60, color:t.text }}>Todo lo que necesitas</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20, maxWidth:1100, margin:'0 auto' }}>
                    {FEATURES.map((f,i) => (
                        <div key={i} className="g-card" style={{ background:cardBg, border:`1px solid ${cardBorder}` }}>
                            <div style={{ fontSize:32, marginBottom:16 }}>{f.icon}</div>
                            <h3 style={{ fontSize:16, fontWeight:600, marginBottom:10, color:t.text }}>{f.title}</h3>
                            <p style={{ fontSize:14, color:t.muted, lineHeight:1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA final */}
            <section style={{ textAlign:'center', padding:'100px 48px', borderTop:`1px solid ${t.dark?'#222228':'#d4c8b0'}` }}>
                <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,48px)', marginBottom:20, color:t.text }}>Listo para empezar</h2>
                <p style={{ color:t.muted, fontSize:16, marginBottom:40, maxWidth:400, margin:'0 auto 40px' }}>
                    Crea tu cuenta gratis y comienza a organizar tu biblioteca visual hoy.
                </p>
                <Link to="/register" className="g-cta">Crear cuenta gratis</Link>
            </section>

            {/* Footer */}
            <footer style={{ borderTop:`1px solid ${t.dark?'#222228':'#d4c8b0'}`, padding:'28px 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
                    <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:18, color:'#c9a84c' }}>J</span>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:13, letterSpacing:3, textTransform:'uppercase', color:t.text }}>SHARPIX</span>
                </div>
                <p style={{ fontSize:12, color:t.muted }}>© 2026 JSharPix. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}