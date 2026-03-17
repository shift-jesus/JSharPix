import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'


const PHOTOS = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&q=80',
    'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80',
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=300&q=80',
    'https://images.unsplash.com/photo-1501492673258-2af8d3be1b8b?w=300&q=80',
    'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=300&q=80',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&q=80',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=300&q=80',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=300&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&q=80',
]

function PhotoColumn({ photos, duration, delay, reverse }) {
    const doubled = [...photos, ...photos]
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', animation:`scrollCol ${duration} linear infinite ${reverse?'reverse':'normal'}`, animationDelay:delay, flex:1 }}>
            {doubled.map((src,i) => (
                <div key={i} className="photo-tile-cascade">
                    <img src={src} alt="" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block', pointerEvents:'none' }} />
                </div>
            ))}
        </div>
    )
}

export default function Register() {
    const [username, setUsername]     = useState('')
    const [email, setEmail]           = useState('')
    const [password, setPassword]     = useState('')
    const [error, setError]           = useState('')
    const [loading, setLoading]       = useState(false)
    const [focusField, setFocusField] = useState('')
    const { register } = useAuth()
    const navigate     = useNavigate()
    const t            = useTheme()

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try { await register(username, email, password); navigate('/') }
        catch (err) { setError(err.response?.data?.message || 'Error al crear la cuenta') }
        finally { setLoading(false) }
    }

    const cols = [
        PHOTOS.slice(0,5),  PHOTOS.slice(5,10),
        PHOTOS.slice(10,15), PHOTOS.slice(15,20), PHOTOS.slice(17,22),
    ]

    return (
        <div style={{ position:'relative', display:'flex', minHeight:'100vh', overflow:'hidden', background:t.bg, color:t.text, transition:'background .4s, color .4s' }}>
            <style>{`
        @keyframes scrollCol { from{transform:translateY(0)} to{transform:translateY(-50%)} }
        @keyframes logoIn { from{opacity:0;transform:translateY(24px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes goldGlow { 0%,100%{text-shadow:0 0 40px rgba(201,168,76,.4)} 50%{text-shadow:0 0 100px rgba(201,168,76,.85)} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.75} }
        .photo-tile-cascade { border-radius:10px; overflow:hidden; flex-shrink:0; transition:transform .35s,box-shadow .35s,opacity .35s; opacity:.72; }
        .photo-tile-cascade:hover { transform:scale(1.07); box-shadow:0 8px 32px rgba(0,0,0,.7); opacity:1; position:relative; z-index:5; }
        .photo-bg-reg::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 55% 60% at 28% 50%,rgba(8,8,9,0.82) 0%,transparent 70%); pointer-events:none; z-index:1; }
        .r-wrap { position:relative; margin-bottom:18px; }
        .r-wrap label { display:block; font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:8px; transition:color .3s; }
        .r-wrap input { width:100%; padding:12px 16px; border-radius:8px; font-family:'Syne',sans-serif; font-size:14px; outline:none; transition:border-color .3s,box-shadow .3s,transform .2s; }
        .r-wrap input:focus { transform:translateY(-1px); }
        .r-line { position:absolute; bottom:0; left:0; height:2px; background:#c9a84c; border-radius:2px; transition:width .35s cubic-bezier(.22,1,.36,1); }
        .btn-rip { position:relative; overflow:hidden; cursor:pointer; }
        .btn-rip::after { content:''; position:absolute; border-radius:50%; background:rgba(255,255,255,.2); top:50%; left:50%; width:0; height:0; transform:translate(-50%,-50%); transition:width .55s,height .55s,opacity .55s; opacity:.4; }
        .btn-rip:hover::after { width:500px; height:500px; opacity:0; }
      `}</style>

            {/* Cascada */}
            <div className="photo-bg-reg" style={{ position:'absolute', inset:0, display:'flex', gap:'10px', padding:'0 10px', zIndex:0, overflow:'hidden' }}>
                {cols.map((col,i) => <PhotoColumn key={i} photos={col} duration={`${20+i*3}s`} delay={`-${i*4}s`} reverse={i%2===1} />)}
            </div>
            <div style={{ position:'absolute', inset:0, zIndex:1, background:t.overlay, transition:'background .4s', pointerEvents:'none' }} />

            {/* Toggle */}
            <div style={{ position:'fixed', top:24, right:24, zIndex:200 }}><ThemeToggle /></div>

            {/* Orb */}
            <div style={{ position:'fixed', bottom:28, left:28, zIndex:200, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ position:'relative', width:48, height:48 }}>
                    {[16,8,0].map((ins,i) => <div key={i} style={{ position:'absolute', inset:ins, borderRadius:'50%', border:'1.5px solid rgba(201,168,76,0.35)', animation:`orbPulse ${1.8+i*.3}s ease-in-out infinite`, animationDelay:`${i*.25}s` }} />)}
                    <div style={{ position:'absolute', inset:14, background:'#c9a84c', borderRadius:'50%', animation:'orbPulse 2s ease-in-out infinite' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {['GitHub','About'].map(l => (
                        <a key={l} href="#" style={{ fontSize:12, color:t.muted, textDecoration:'none', fontFamily:'Syne,sans-serif', letterSpacing:.5, transition:'color .2s' }}
                           onMouseEnter={e => e.target.style.color='#c9a84c'}
                           onMouseLeave={e => e.target.style.color=t.muted}
                        >{l}</a>
                    ))}
                </div>
            </div>

            {/* Panel izquierdo */}
            <div style={{ position:'relative', zIndex:2, flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'60px 40px' }}>
                <div style={{ textAlign:'center', animation:'logoIn 1.2s cubic-bezier(.22,1,.36,1) both' }}>
                    <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:100, color:'#c9a84c', display:'block', lineHeight:1, animation:'goldGlow 3s ease-in-out infinite', filter:'drop-shadow(0 0 30px rgba(201,168,76,0.5))' }}>J</span>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:28, color: t.dark ? '#f0efe8' : '#1a1410', letterSpacing:8, textTransform:'uppercase', display:'block', marginTop:6, textShadow: t.dark ? '0 2px 20px rgba(0,0,0,0.8)' : 'none' }}>SHARPIX</span>
                </div>
                <p style={{ fontSize:15, color: t.dark ? 'rgba(240,239,232,0.65)' : 'rgba(26,20,16,0.7)', textAlign:'center', lineHeight:2, marginTop:24, maxWidth:280, textShadow: t.dark ? '0 1px 12px rgba(0,0,0,0.9)' : 'none' }}>
                    Únete a JSharPix y crea<br/>tu biblioteca visual privada.
                </p>
            </div>

            {/* Panel derecho */}
            <div style={{ position:'relative', zIndex:2, width:480, display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 52px', background:t.panelBg, backdropFilter:'blur(24px)', borderLeft:`1px solid ${t.panelBorder}`, transition:'background .4s' }}>
                <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, marginBottom:8, color:t.text }}>Crear cuenta</h1>
                <p style={{ color:t.muted, fontSize:14, marginBottom:28 }}>Es gratis y solo toma un momento</p>

                {error && (
                    <div style={{ padding:'12px 16px', background:'rgba(217,92,92,.1)', color:'#e07070', border:'1px solid rgba(217,92,92,.4)', borderRadius:8, fontSize:13, marginBottom:18 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { id:'username', label:'Usuario',    type:'text',     val:username, set:setUsername },
                        { id:'email',    label:'Correo',     type:'email',    val:email,    set:setEmail    },
                        { id:'password', label:'Contraseña', type:'password', val:password, set:setPassword },
                    ].map(f => (
                        <div key={f.id} className="r-wrap">
                            <label style={{ color:focusField===f.id?'#c9a84c':t.muted }}>{f.label}</label>
                            <input type={f.type} value={f.val} required
                                   onChange={e => f.set(e.target.value)}
                                   onFocus={() => setFocusField(f.id)}
                                   onBlur={() => setFocusField('')}
                                   style={{ background:t.inputBg, border:`1px solid ${focusField===f.id?'#c9a84c':t.inputBorder}`, color:t.text, boxShadow:focusField===f.id?'0 0 0 3px rgba(201,168,76,0.15)':'none' }}
                            />
                            <div className="r-line" style={{ width:focusField===f.id?'100%':'0%' }} />
                        </div>
                    ))}
                    <div style={{ marginTop:10 }}>
                        <button type="submit" disabled={loading} className="btn-rip"
                                style={{ width:'100%', padding:'14px', background:'#c9a84c', color:'#0a0800', border:'none', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:12, transition:'transform .2s,box-shadow .2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(201,168,76,.45)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
                        >{loading ? 'Creando...' : 'Crear cuenta'}</button>
                    </div>
                </form>

                <p style={{ textAlign:'center', fontSize:13, color:t.muted, marginTop:8 }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color:'#c9a84c', textDecoration:'none', fontWeight:600 }}>Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}