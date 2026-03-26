# JSharPix 📸

> Tu biblioteca visual privada — donde cada fotografía tiene su lugar.

JSharPix es una aplicación web fullstack para fotógrafos que quieren una galería personal privada, con sistema de conexiones para compartir fotos seleccionadas con amigos de confianza.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 8, React Router v6, Axios |
| Estilos | Tailwind CSS + CSS-in-JS inline |
| Backend | Python 3.14 + Flask, SQLAlchemy, Flask-Login, Flask-CORS |
| Base de datos | SQLite |
| Imágenes | Pillow |

---

## Estructura del proyecto

```
JSharPix.Offi/
├── backend/
│   ├── run.py            # Entry point Flask
│   ├── models.py         # User, Photo, Friendship
│   ├── auth.py           # Endpoints de autenticación
│   ├── routes.py         # Endpoints de fotos y conexiones
│   ├── config.py         # Configuración
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Gallery.jsx
│       │   ├── Upload.jsx
│       │   ├── Profile.jsx
│       │   ├── Friends.jsx
│       │   ├── FriendGallery.jsx
│       │   ├── PhotoDetail.jsx
│       │   └── Guest.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ShareCard.jsx
│       │   ├── Toast.jsx
│       │   ├── ThemeToggle.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       └── services/
│           └── api.js
└── instance/
    └── jsharpix.db
```

---

## Instalación y uso

### Requisitos previos

- Python 3.10+
- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
pip install -r requirements.txt
py run.py
```

El servidor corre en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

La app corre en `http://localhost:5173`

---

## Funcionalidades

### Autenticación
- Registro e inicio de sesión con sesión persistente
- Página de invitado para ver demo sin cuenta

### Galería personal
- Upload de fotos con drag & drop
- Layout configurable: **Masonry**, **Grid** o **Slider**
- Modal fullscreen con navegación por teclado (← →) y thumbnails
- Fondo personalizable: colores predefinidos, hex personalizado, imagen/GIF/video
- Toggle público/privado por foto

### Perfil
- Avatar y banner personalizables
- Alias artístico, biografía, ubicación, sitio web, ciudad
- Stats: número de fotos y fecha de registro
- Código de acceso permanente para conexiones

### Tarjeta de perfil compartible
- Carta 3D animada con efecto tilt al mover el mouse
- Código temporal que expira cada 30 minutos con contador regresivo
- Shimmer, scan line y corner elements decorativos
- Botón para copiar el código

### Sistema de conexiones
- Cada usuario tiene un código único permanente (`JSP-XXXX-XXXX`)
- Comparte tu código para dar acceso a tus fotos públicas
- Ve la galería pública de tus conexiones
- Privacidad total: solo ven lo que tú marcas como público

### UX y diseño
- Modo oscuro / claro con paleta dorada como acento
- Animaciones de entrada en cascada
- Sistema de toasts para feedback
- Saludo personalizado según hora del día
- Frases fotográficas aleatorias en la galería

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Usuario actual |
| PUT | `/api/auth/profile` | Actualizar perfil |

### Fotos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/photos` | Mis fotos |
| POST | `/api/photos/upload` | Subir fotos |
| DELETE | `/api/photos/:id` | Eliminar foto |
| PUT | `/api/photos/:id/toggle-public` | Cambiar visibilidad |
| GET | `/api/photos/file/:filename` | Servir archivo |
| POST | `/api/photos/avatar` | Subir avatar |
| POST | `/api/photos/banner` | Subir banner |

### Conexiones
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/photos/friends/connect` | Conectar con código |
| GET | `/api/photos/friends/list` | Mis conexiones |
| GET | `/api/photos/friends/:id/gallery` | Galería de conexión |

---

## Variables de entorno

Crea un archivo `.env` en `/backend`:

```env
SECRET_KEY=tu_clave_secreta_aqui
UPLOAD_FOLDER=../uploads
MAX_CONTENT_LENGTH=16777216
```

---

## Historial de versiones

| Versión | Descripción |
|---------|-------------|
| 1.0 | Estructura base del proyecto |
| 1.1 | Backend Flask + Frontend React base |
| 1.2 | Branding, temas, Login/Register, Guest, Navbar |
| 1.3 | Galería masonry, Upload drag & drop, perfil completo |
| 1.4 | Conexiones, privacidad de fotos, tarjeta compartible, fondo personalizable, layouts funcionales |

---

## Autor

**shift-jesus** — [GitHub](https://github.com/shift-jesus/JSharPix)

---

*JSharPix — Donde cada fotografía tiene su lugar.*