import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './Toast'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const t        = useTheme()
    const toast    = useToast()

    const handleLogout = async () => {
        await logout()
        toast('¡Hasta pronto! Sesión cerrada', 'info')
        navigate('/login')
    }

    const closeDropdown = () => {
        const menu = document.getElementById('profile-dropdown')
        if (menu) menu.style.display = 'none'
    }

    const toggleDropdown = () => {
        const menu = document.getElementById('profile-dropdown')
        if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
    }

    const isActive = (path) => location.pathname === path

    const navBg     = t.dark ? 'rgba(8,8,9,0.88)'  : 'rgba(242,237,228,0.95)'
    const navBorder = t.dark ? '#222228'            : '#d4c8b0'
    const dropBg    = t.dark ? '#18181d'            : '#f2ede4'

    const hour = new Date().getHours()
    const greeting     = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
    const greetingIcon = hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙'

    return (
        <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 40px', height:68, background:navBg, backdropFilter:'blur(16px)', borderBottom:`1px solid ${navBorder}`, position:'sticky', top:0, zIndex:100, transition:'background .4s' }}>
            <style>{`
        @keyframes navIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .nav-link { font-family:'Syne',sans-serif; font-size:13px; font-weight:500; text-decoration:none; padding:6px 14px; border-radius:8px; transition:all .2s; letter-spacing:0.3px; }
        .drop-btn { width:100%; padding:10px 16px; background:transparent; border:none; font-family:'Syne',sans-serif; font-size:13px; cursor:pointer; text-align:left; border-radius:8px; transition:background .2s; display:flex; align-items:center; gap:8px; }
      `}</style>

            {/* Logo */}
            <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'baseline', gap:2, animation:'navIn .4s ease both' }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:24, color:'#c9a84c' }}>J</span>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:16, color:t.text, letterSpacing:3, textTransform:'uppercase' }}>SHARPIX</span>
            </Link>

            {/* Saludo central */}
            {user && (
                <div style={{ display:'flex', alignItems:'center', gap:6, animation:'navIn .4s .1s ease both' }}>
                    <span style={{ fontSize:16 }}>{greetingIcon}</span>
                    <span style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:t.muted }}>
            {greeting},{' '}
                        <span style={{ color:'#c9a84c', fontWeight:600 }}>{user.alias || user.username}</span>
          </span>
                </div>
            )}

            {/* Derecha */}
            <div style={{ display:'flex', alignItems:'center', gap:16, animation:'navIn .4s .2s ease both' }}>

                <Link to="/" className="nav-link"
                      style={{ color:isActive('/')?'#c9a84c':t.muted, background:isActive('/')?'rgba(201,168,76,0.1)':'transparent' }}
                      onMouseEnter={e => { if(!isActive('/')) { e.currentTarget.style.color=t.text; e.currentTarget.style.background=t.dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)' }}}
                      onMouseLeave={e => { if(!isActive('/')) { e.currentTarget.style.color=t.muted; e.currentTarget.style.background='transparent' }}}
                >Galería</Link>

                <Link to="/upload" style={{ background:'#c9a84c', color:'#0a0800', padding:'8px 18px', borderRadius:8, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, letterSpacing:.5, textDecoration:'none', transition:'transform .2s,box-shadow .2s', display:'flex', alignItems:'center', gap:6 }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(201,168,76,.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
                >+ Subir</Link>

                <ThemeToggle />

                {/* Avatar dropdown */}
                {user && (
                    <div style={{ position:'relative' }}>
                        <div
                            style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#c9a84c,#a07c30)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#0a0800', border:'2px solid rgba(201,168,76,0.3)', transition:'border-color .2s,transform .2s', userSelect:'none', overflow:'hidden' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.transform='scale(1.05)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'; e.currentTarget.style.transform='scale(1)' }}
                            onClick={toggleDropdown}
                        >
                            {user.avatar
                                ? <img src={`http://localhost:5000/api/photos/file/${user.avatar}`} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : user.username[0].toUpperCase()
                            }
                        </div>

                        <div id="profile-dropdown" style={{ display:'none', position:'absolute', top:'calc(100% + 12px)', right:0, background:dropBg, border:`1px solid ${navBorder}`, borderRadius:12, padding:8, minWidth:210, boxShadow:'0 16px 48px rgba(0,0,0,0.4)', zIndex:200 }}>
                            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${navBorder}`, marginBottom:4 }}>
                                <p style={{ color:t.text, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:600, margin:0 }}>{user.alias || user.username}</p>
                                <p style={{ color:t.muted, fontFamily:'Syne,sans-serif', fontSize:12, margin:'3px 0 0' }}>{user.email}</p>
                            </div>

                            <button className="drop-btn" style={{ color:t.text }}
                                    onClick={() => { navigate('/profile'); closeDropdown() }}
                                    onMouseEnter={e => e.currentTarget.style.background=t.dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            ><span>👤</span> Mi perfil</button>

                            <button className="drop-btn" style={{ color:t.text }}
                                    onClick={() => { navigate('/'); closeDropdown() }}
                                    onMouseEnter={e => e.currentTarget.style.background=t.dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            ><span>🖼️</span> Mi galería</button>

                            <button className="drop-btn" style={{ color:t.text }}
                                    onClick={() => { navigate('/upload'); closeDropdown() }}
                                    onMouseEnter={e => e.currentTarget.style.background=t.dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            ><span>📸</span> Subir fotos</button>

                            <div style={{ borderTop:`1px solid ${navBorder}`, marginTop:4, paddingTop:4 }}>
                                <button className="drop-btn" style={{ color:'#d95c5c' }}
                                        onClick={handleLogout}
                                        onMouseEnter={e => e.currentTarget.style.background='rgba(217,92,92,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                                ><span>→</span> Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}