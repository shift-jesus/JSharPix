import { createContext, useContext, useState } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(true)
    const toggle = () => setDark(d => !d)

    const theme = {
        dark,
        toggle,
        bg:          dark ? '#080809'               : '#f2ede4',
        text:        dark ? '#f0efe8'               : '#1a1410',
        panelBg:     dark ? 'rgba(8,8,9,0.82)'      : 'rgba(242,237,228,0.95)',
        panelBorder: dark ? 'rgba(201,168,76,0.18)' : 'rgba(160,124,48,0.3)',
        inputBg:     dark ? '#18181d'               : '#e8e0ce',
        inputBorder: dark ? '#2e2e38'               : '#c8b898',
        muted:       dark ? 'rgba(240,239,232,0.5)' : 'rgba(26,20,16,0.55)',
        surface:     dark ? '#111114'               : '#ece6d8',
        border:      dark ? '#222228'               : '#d4c8b0',
        overlay:     dark
            ? 'radial-gradient(ellipse at 35% 50%, rgba(8,8,9,.45) 0%, rgba(8,8,9,.85) 100%)'
            : 'radial-gradient(ellipse at 35% 50%, rgba(242,237,228,.5) 0%, rgba(242,237,228,.95) 100%)',
        navBg:       dark ? 'rgba(8,8,9,0.85)'      : 'rgba(242,237,228,0.95)',
        navBorder:   dark ? '#222228'               : '#d4c8b0',
        cardBg:      dark ? '#111114'               : '#ece6d8',
        cardBorder:  dark ? '#222228'               : '#d4c8b0',
    }

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}