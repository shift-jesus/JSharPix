import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { dark, toggle } = useTheme()
    return (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>{dark ? '🌙' : '☀️'}</span>
            <div style={{ position:'relative', width:56, height:28, cursor:'pointer' }} onClick={toggle}>
                <div style={{
                    position:'absolute', inset:0, borderRadius:14,
                    background: dark ? '#28292c' : '#c9a84c',
                    border:`2px solid ${dark ? '#3a3b3e' : '#a07c30'}`,
                    transition:'background .3s'
                }} />
                <div style={{
                    position:'absolute', top:4,
                    left: dark ? 4 : 28,
                    width:20, height:20, borderRadius:'50%',
                    background: dark ? '#d8dbe0' : '#f2ede4',
                    transition:'left .3s',
                    boxShadow: dark ? 'inset 6px -2px 0 0 #28292c' : 'none'
                }} />
            </div>
        </div>
    )
}