import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now()
        setToasts(t => [...t, { id, message, type }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
    }, [])

    const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id))

    const colors = {
        success: { bg:'rgba(76,175,130,.12)', border:'rgba(76,175,130,.4)', color:'#4caf82', icon:'✓' },
        error:   { bg:'rgba(217,92,92,.12)',  border:'rgba(217,92,92,.4)',  color:'#d95c5c', icon:'✕' },
        info:    { bg:'rgba(201,168,76,.12)', border:'rgba(201,168,76,.4)', color:'#c9a84c', icon:'ℹ' },
    }

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div style={{ position:'fixed', bottom:32, right:32, zIndex:9999, display:'flex', flexDirection:'column', gap:10 }}>
                <style>{`
          @keyframes toastIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
          @keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)} }
        `}</style>
                {toasts.map(toast => {
                    const c = colors[toast.type] || colors.success
                    return (
                        <div key={toast.id}
                             style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:c.bg, border:`1px solid ${c.border}`, borderRadius:10, backdropFilter:'blur(12px)', minWidth:280, maxWidth:360, animation:'toastIn .3s cubic-bezier(.22,1,.36,1) both', cursor:'pointer', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}
                             onClick={() => removeToast(toast.id)}
                        >
                            <span style={{ color:c.color, fontSize:18, fontWeight:700, flexShrink:0 }}>{c.icon}</span>
                            <p style={{ color:'#f0efe8', fontFamily:'Syne,sans-serif', fontSize:13, margin:0, lineHeight:1.5 }}>{toast.message}</p>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}