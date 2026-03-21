import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ShareCard({ user, onClose }) {
    const t = useTheme()
    const cardRef = useRef()
    const [copied, setCopied] = useState(false)
    const [timeLeft, setTimeLeft] = useState('')
    const [visible, setVisible] = useState(false)
    const animating = useRef(false)

    useEffect(() => {
        setTimeout(() => setVisible(true), 50)
    }, [])

    useEffect(() => {
        const updateTimer = () => {
            if (!user.share_token_expires) return
            const expires = new Date(user.share_token_expires)
            const now = new Date()
            const diff = expires - now
            if (diff <= 0) { setTimeLeft('Expirado'); return }
            const mins = Math.floor(diff / 60000)
            const secs = Math.floor((diff % 60000) / 1000)
            setTimeLeft(mins + ':' + (secs < 10 ? '0' + secs : secs))
        }
        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [user])

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const handleMove = (e) => {
            animating.current = true
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const cx = rect.width / 2
            const cy = rect.height / 2
            const rx = ((y - cy) / cy) * -15
            const ry = ((x - cx) / cx) * 15
            card.style.transition = 'transform .1s ease, box-shadow .3s'
            card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.04)'
            card.style.boxShadow = '0 0 80px rgba(201,168,76,.4), inset 0 0 60px rgba(0,0,0,.4)'
        }

        const handleLeave = () => {
            animating.current = false
            card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), box-shadow .3s'
            card.style.transform = 'perspective(800px) rotateX(-15deg) translateY(0px)'
            card.style.boxShadow = '0 0 50px rgba(201,168,76,.15), inset 0 0 90px rgba(0,0,0,.5)'
        }

        card.addEventListener('mousemove', handleMove)
        card.addEventListener('mouseleave', handleLeave)
        return () => {
            card.removeEventListener('mousemove', handleMove)
            card.removeEventListener('mouseleave', handleLeave)
        }
    }, [visible])

    const copyCode = () => {
        navigator.clipboard.writeText(user.share_token)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 400)
    }

    const avatarUrl = user.avatar ? 'http://localhost:5000/api/photos/file/' + user.avatar : null

    return (
        <div
            style={{ position:'fixed', inset:0, zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)', background:'rgba(0,0,0,' + (visible ? '.75' : '0') + ')', transition:'background .4s ease' }}
            onClick={handleClose}
        >
            <style>{`
        @keyframes cardAppear {
          from { opacity:0; transform:perspective(800px) rotateX(-15deg) scale(.7) translateY(40px); }
          to   { opacity:1; transform:perspective(800px) rotateX(-15deg) scale(1) translateY(0px); }
        }
        @keyframes cardDisappear {
          from { opacity:1; transform:perspective(800px) rotateX(-15deg) scale(1); }
          to   { opacity:0; transform:perspective(800px) rotateX(-15deg) scale(.7) translateY(40px); }
        }
        @keyframes shimmer {
          0%   { transform:translateX(-100%) rotate(25deg); }
          100% { transform:translateX(400%) rotate(25deg); }
        }
        @keyframes scanLine {
          0%   { top:-30%; }
          100% { top:130%; }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50%      { opacity:.4; }
        }
        @keyframes btnAppear {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .share-card-enter { animation: cardAppear .5s cubic-bezier(.22,1,.36,1) both; }
        .share-card-exit  { animation: cardDisappear .4s ease both; }
      `}</style>

            <div
                className={visible ? 'share-card-enter' : 'share-card-exit'}
                onClick={e => e.stopPropagation()}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}
            >
                {/* Tarjeta */}
                <div
                    ref={cardRef}
                    style={{ position:'relative', width:220, height:320, borderRadius:20, background:'linear-gradient(145deg,#1a1410,#2a2018,#1a1814)', border:'1px solid rgba(201,168,76,.25)', boxShadow:'0 0 50px rgba(201,168,76,.15), inset 0 0 90px rgba(0,0,0,.5)', overflow:'hidden', cursor:'default', transform:'perspective(800px) rotateX(-15deg) translateY(0px)' }}
                >
                    {/* Scan line */}
                    <div style={{ position:'absolute', left:0, right:0, height:'25%', background:'linear-gradient(to bottom,transparent,rgba(201,168,76,.05),transparent)', animation:'scanLine 3s linear infinite', pointerEvents:'none', zIndex:2 }} />

                    {/* Shimmer */}
                    <div style={{ position:'absolute', top:0, left:0, width:'35%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)', transform:'rotate(25deg) translateX(-100%)', animation:'shimmer 5s linear infinite', pointerEvents:'none', zIndex:2 }} />

                    {/* Corner elements */}
                    {[
                        { top:10, left:10, borderRight:'none', borderBottom:'none' },
                        { top:10, right:10, borderLeft:'none', borderBottom:'none' },
                        { bottom:10, left:10, borderRight:'none', borderTop:'none' },
                        { bottom:10, right:10, borderLeft:'none', borderTop:'none' },
                    ].map((s, i) => (
                        <div key={i} style={{ position:'absolute', width:14, height:14, border:'1.5px solid rgba(201,168,76,.5)', ...s, zIndex:3 }} />
                    ))}

                    {/* Líneas horizontales */}
                    {[18, 42, 66, 84].map((top, i) => (
                        <div key={i} style={{ position:'absolute', top:top + '%', left:0, width:'100%', height:1, background:'linear-gradient(90deg,transparent,rgba(201,168,76,.1),transparent)', zIndex:1 }} />
                    ))}

                    {/* Contenido */}
                    <div style={{ position:'relative', zIndex:4, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', gap:10 }}>

                        {/* Avatar */}
                        <div style={{ width:68, height:68, borderRadius:'50%', border:'2px solid rgba(201,168,76,.6)', background:'linear-gradient(135deg,#c9a84c,#a07c30)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 0 24px rgba(201,168,76,.3)' }}>
                            {avatarUrl
                                ? <img src={avatarUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:28, color:'#0a0800' }}>{user.username[0].toUpperCase()}</span>
                            }
                        </div>

                        {/* Nombre */}
                        <div style={{ textAlign:'center' }}>
                            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, color:'#f0efe8', margin:'0 0 3px', letterSpacing:.5 }}>
                                {user.alias || user.username}
                            </h2>
                            <p style={{ color:'rgba(201,168,76,.6)', fontFamily:'Syne,sans-serif', fontSize:11, margin:0, letterSpacing:2, textTransform:'uppercase' }}>@{user.username}</p>
                        </div>

                        {/* Divider */}
                        <div style={{ width:'80%', height:1, background:'linear-gradient(90deg,transparent,rgba(201,168,76,.35),transparent)' }} />

                        {/* Stats */}
                        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                            <div style={{ textAlign:'center' }}>
                                <p style={{ color:'#c9a84c', fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, margin:0, lineHeight:1 }}>{user.photo_count || 0}</p>
                                <p style={{ color:'rgba(240,239,232,.4)', fontFamily:'Syne,sans-serif', fontSize:9, margin:'3px 0 0', letterSpacing:1, textTransform:'uppercase' }}>Fotos</p>
                            </div>
                            {user.gear_location && (
                                <div style={{ textAlign:'center' }}>
                                    <p style={{ color:'rgba(240,239,232,.6)', fontFamily:'Syne,sans-serif', fontSize:12, margin:0 }}>📍 {user.gear_location}</p>
                                </div>
                            )}
                        </div>

                        {/* Token */}
                        <div style={{ background:'rgba(201,168,76,.08)', border:'1px solid rgba(201,168,76,.2)', borderRadius:10, padding:'8px 14px', textAlign:'center', width:'100%' }}>
                            <p style={{ color:'rgba(240,239,232,.4)', fontFamily:'Syne,sans-serif', fontSize:9, letterSpacing:2, textTransform:'uppercase', margin:'0 0 4px' }}>Código temporal</p>
                            <p style={{ color:'#c9a84c', fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, margin:0, letterSpacing:3 }}>{user.share_token}</p>
                            <p style={{ color:'rgba(240,239,232,.3)', fontFamily:'Syne,sans-serif', fontSize:9, margin:'4px 0 0', animation:'pulse 1.5s infinite' }}>
                                {timeLeft ? 'Expira en ' + timeLeft : 'Cargando...'}
                            </p>
                        </div>

                        {/* Branding */}
                        <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
                            <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:14, color:'#c9a84c' }}>J</span>
                            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:9, color:'rgba(240,239,232,.3)', letterSpacing:3, textTransform:'uppercase' }}>SHARPIX</span>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div style={{ display:'flex', gap:12, animation:'btnAppear .5s .3s ease both' }}>
                    <button
                        onClick={copyCode}
                        style={{ padding:'10px 24px', background:copied ? '#4caf82' : '#c9a84c', color:'#0a0800', border:'none', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .3s', letterSpacing:.5 }}
                        onMouseEnter={e => { if (!copied) e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        {copied ? '✓ Copiado!' : '📋 Copiar código'}
                    </button>
                    <button
                        onClick={handleClose}
                        style={{ padding:'10px 24px', background:'transparent', color:'rgba(240,239,232,.6)', border:'1px solid rgba(255,255,255,.15)', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, cursor:'pointer', transition:'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'; e.currentTarget.style.color = '#f0efe8' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'; e.currentTarget.style.color = 'rgba(240,239,232,.6)' }}
                    >Cerrar</button>
                </div>
            </div>
        </div>
    )
}