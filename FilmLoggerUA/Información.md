# FilmLoggerUA - Guía de Instalación y Desarrollo

## Stack Tecnológico

- **Frontend:** React 19.2.0 + Vite (módulos ESM)
- **Backend:** Node.js + Express 5.2.1 (CommonJS)
- **Herramientas Frontend:** ESLint, Vite bundler, HMR
- **Herramientas Backend:** Nodemon (desarrollo), CORS, dotenv
- **Base de Datos:** Supabase (PostgreSQL) — *credenciales en `.env`*
PASS: FilmLoggerPass123
- **Infraestructura:** Hetzner VPS (opcional para producción)
- **Herramientas de Diseño:** Figma
- **Seguridad:** HTTPS (en producción)

---

## Requisitos Previos

- **Sistema:** macOS / Linux / Windows con WSL2
- **Herramientas globales:**
  - `git` (v2.30+)
  - `node` (v18+ recomendado)
  - `npm` (v9+)
- **Cuentas necesarias:**
  - GitHub (acceso al repo `AbelMRTZ/FilmLoggerUA`)
  - Supabase (opcional, para acceso directo a BD)
  - SSH/HTTPS credentials (para despliegue en Hetzner)

## 1. Clonar el Repositorio

```bash
# HTTPS (requiere GitHub token)
git clone https://github.com/AbelMRTZ/FilmLoggerUA.git
cd FilmLoggerUA

# SSH (requiere clave SSH configurada)
# git clone git@github.com:AbelMRTZ/FilmLoggerUA.git
```

---

## 2. Configuración del Backend (Node.js + Express)

### 2.1 Instalar dependencias del backend

```bash
cd server
npm install
```

El backend usa las siguientes dependencias:
- **express** (5.2.1) — framework web
- **cors** (2.8.6) — para compartir recursos entre dominios
- **dotenv** (17.3.1) — cargar variables de entorno
- **nodemon** (3.1.14 dev) — auto-reload en desarrollo

### 2.2 Configurar variables de entorno

Crea un archivo `.env` en `server/`:

```env
# Puerto de ejecución
PORT=5000

# Entorno
NODE_ENV=development

# Supabase (opcional, si necesitas conectar con BD)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role

# CORS (ajusta según URL del frontend)
FRONTEND_URL=http://localhost:5173

# JWT Secret (si usas autenticación)
JWT_SECRET=tu-secret-generado-con-openssl-rand-base64-32
```

### 2.3 Ejecutar el backend en desarrollo

```bash
npm run dev
# El servidor estará disponible en http://localhost:5000
# Hot-reload habilitado via nodemon
```

### 2.4 Estructura actual del backend

```
server/
├── index.js              # Servidor Express con endpoint /api/health
├── .env                  # Variables de entorno (local, NO en Git)
├── package.json          # Dependencias
├── node_modules/         # Instalado via npm install
└── package-lock.json
```

Endpoint disponible por defecto:
- `GET /api/health` → `{ message: "Server running" }`

## 3. Configuración del Frontend (React + Vite)

### 3.1 Instalar dependencias del frontend

```bash
cd ../client
npm install
```

El frontend usa las siguientes dependencias:
- **react** (19.2.0) — librería UI
- **react-dom** (19.2.0) — renderizado en DOM
- **vite** (7.3.1 dev) — bundler rápido con HMR
- **@vitejs/plugin-react** (5.1.1 dev) — soporte JSX en Vite
- **eslint** + plugins (dev) — linting de código

### 3.2 Configurar variables de entorno (opcional)

Si necesitas conectar con una API o Supabase, crea `.env.local` en `client/`:

```env
# Backend API
VITE_API_URL=http://localhost:5000

# Supabase (si lo usas directo desde frontend)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

**Nota:** Las variables en Vite deben tener prefijo `VITE_` para ser accesibles en el código.

### 3.3 Ejecutar el frontend en desarrollo

```bash
npm run dev
# Se abre automáticamente en http://localhost:5173
# HMR habilitado: hot module replacement funciona
```

### 3.4 Build para producción

```bash
npm run build
# Genera carpeta `dist/` lista para desplegar
```

### 3.5 Linting

```bash
npm run lint
# Verifica código con ESLint
```

### 3.6 Estructura actual del frontend

```
client/
├── src/
│   ├── App.jsx           # Componente raíz
│   ├── App.css           # Estilos de la app
│   ├── main.jsx          # Entrada (renderiza en #root del HTML)
│   ├── index.css         # Estilos globales
│   └── assets/           # Imágenes, fuentes, etc.
├── index.html            # HTML base (busca #root para React)
├── public/               # Archivos estáticos
├── vite.config.js        # Configuración Vite
├── eslint.config.js      # Configuración ESLint
├── package.json
├── package-lock.json
└── node_modules/
```

---

## 4. Estructura del Proyecto

```
FilmLoggerUA/
├── server/                    # Backend Express (CommonJS)
│   ├── index.js              # Archivo principal - servidor escucha en PORT
│   ├── .env                  # Variables de entorno (NO en Git)
│   ├── package.json          # Dependencias backend
│   ├── package-lock.json
│   └── node_modules/
│
├── client/                     # Frontend React + Vite (ESM)
│   ├── src/
│   │   ├── App.jsx           # Componente principal
│   │   ├── App.css           # Estilos de la app
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Estilos globales
│   │   └── assets/
│   ├── public/               # Archivos estáticos
│   ├── index.html            # HTML que renderiza React
│   ├── vite.config.js        # Configuración del bundler
│   ├── eslint.config.js      # Configuración de linter
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
├── .git/                      # Repositorio Git
├── .gitignore
├── Información.md            # Esta guía
└── README.md (opcional)      # Descripción del proyecto
```

**Nota:** No hay carpetas `backend/` o `frontend/` — se llaman `server/` y `client/`.

---

## 5. Scripts y Comandos Útiles

### Backend

```bash
cd server

# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start

# Instalar dependencias
npm install

# Añadir paquete nuevo
npm install nombre-paquete
npm install -D nombre-paquete  # Solo desarrollo
```

### Frontend

```bash
cd client

# Desarrollo (con HMR)
npm run dev

# Build de producción
npm run build

# Preview de la build local
npm run preview

# Linting
npm run lint

# Instalar dependencias
npm install
```

---

## 6. Flujo de Desarrollo (Git y Colaboración)

### Obtener cambios del remoto

```bash
# Descargar cambios sin aplicarlos
git fetch origin

# Descargar y aplicar cambios de main
git pull origin main
```

### Crear una rama para tu feature

```bash
# Crear y cambiar a nueva rama
git checkout -b feat/nombre-feature

# O si ya existe
git checkout feat/nombre-feature
```

### Hacer cambios y commits

```bash
# Ver cambios
git status

# Agregar archivos modificados
git add server/   # o client/ o ambos

# Commit con mensaje descriptivo
git commit -m "feat(backend): nueva ruta /api/films"
# o
git commit -m "feat(frontend): componente FilmCard"

# Ver historial de commits
git log --oneline
```

### Enviar a GitHub

```bash
# Subir rama al remoto
git push origin feat/nombre-feature

# Crear Pull Request en GitHub (via web)
# - Describe los cambios
# - Espera revisión de colaboradores
# - Resuelve conflictos si hay
# - Merge cuando esté aprobado
```

### Volver a main actualizado

```bash
git checkout main
git pull origin main
```

---

## 7. Trabajar en Local Paralelo

Puedes correr **dos terminales** simultáneamente:

### Terminal 1 - Backend

```bash
cd server
npm run dev
# Escucha en http://localhost:5000
```

### Terminal 2 - Frontend

```bash
cd client
npm run dev
# Se abre en http://localhost:5173
```

Ahora el frontend puede hacer requests al backend en `http://localhost:5000`.

---

## 8. Ejemplo: Llamar al Backend desde Frontend

### Backend (server/index.js)

```javascript
app.get("/api/films", (req, res) => {
  res.json({ films: [] });
});
```

### Frontend (client/src/App.jsx)

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/films')
      .then(r => r.json())
      .then(data => setFilms(data.films))
      .catch(err => console.error(err));
  }, []);

  return <div>Films: {films.length}</div>;
}

export default App;
```

---

## 9. Debugging Local

### Backend

```bash
# Ver logs en terminal donde corre `npm run dev`
# Usar console.log() en index.js

# Testear endpoint con curl
curl http://localhost:5000/api/health

# O con Postman / Insomnia
# GET http://localhost:5000/api/films
```

### Frontend

```bash
# Abrir DevTools del navegador (F12)
# - Console: ver console.log()
# - Network: ver requests al backend
# - Sources: debugear JavaScript

# Usar React DevTools (extensión Chrome/Firefox)

# Terminal donde corre Vite muestra warnings/errors de build
```

---

## 10. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module 'express'` | No instalaste dependencias | `npm install` en `server/` |
| CORS error en frontend | Backend no permite solicitudes del frontend | Añade `FRONTEND_URL` correcto en `.env` backend |
| Puerto 5000 en uso | Otro proceso usa el puerto | `lsof -i :5000` y mata el proceso o cambia `PORT` en `.env` |
| `.env` no se carga | Olvidas hacer `require('dotenv').config()` en index.js | Asegúrate que esté en la primera línea de index.js |
| `npm install` falla | Lock file corrupto o node_modules conflictivo | Borra `node_modules/` y `package-lock.json`, luego `npm install` |

---

## 11. Despliegue en Producción (Hetzner VPS)

### Conectar al servidor

```bash
ssh usuario@IP_DEL_VPS
```

### Clonar repo en servidor

```bash
cd /home/usuario
git clone https://github.com/AbelMRTZ/FilmLoggerUA.git
cd FilmLoggerUA
```

### Instalar y configurar backend

```bash
cd server
npm install --production

# Crear .env con credenciales de producción
nano .env
# PORT=5000
# NODE_ENV=production
# SUPABASE_URL=...
# etc.

# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar servidor con PM2
pm2 start index.js --name "filmlogger" --instances 2

# Hacer que PM2 reinicie al rebootear
pm2 startup
pm2 save
```

### Instalar y servir frontend con Nginx

```bash
cd ../client
npm install --production
npm run build
# Genera dist/

# Instalar Nginx
sudo apt-get update && sudo apt-get install -y nginx

# Crear config en /etc/nginx/sites-available/filmlogger
sudo nano /etc/nginx/sites-available/filmlogger
```

Contenido recomendado:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend React
    location / {
        root /home/usuario/FilmLoggerUA/client/dist;
        try_files $uri /index.html;  # SPA fallback
    }

    # Proxy a backend Express
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/filmlogger /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### HTTPS con Certbot (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Auto-renovación activada por defecto
```

---

## 12. Monitoreo en Producción

```bash
# Ver estado de procesos PM2
pm2 status

# Ver logs en tiempo real
pm2 logs filmlogger

# Ver uso de memoria/CPU
pm2 monit

# Reiniciar si hay problema
pm2 restart filmlogger
```

---

## 13. Variables de Entorno en Supabase

Si tienes un proyecto Supabase, obtén las claves así:

1. Entra en [console.supabase.com](https://console.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (solo backend)

---

## 14. Control de Acceso y Colaboración en GitHub

### Invitar colaboradores con permisos

Usa GitHub CLI (`gh`) para invitar:

```bash
# Permiso admin (control completo del repo)
gh api -X PUT /repos/AbelMRTZ/FilmLoggerUA/collaborators/USERNAME -f permission=admin

# Permiso push (puede hacer push, mergear PRs)
gh api -X PUT /repos/AbelMRTZ/FilmLoggerUA/collaborators/USERNAME -f permission=push

# Permiso pull (solo lectura)
gh api -X PUT /repos/AbelMRTZ/FilmLoggerUA/collaborators/USERNAME -f permission=pull
```

### El colaborador acepta la invitación

- **Vía Email:** recibe correo con "Accept invitation"
- **Vía Web:** va a https://github.com/AbelMRTZ/FilmLoggerUA/invitations
- **Vía CLI:** `gh api -X PATCH /user/repository_invitations/INVITATION_ID`

### Colaboradores actuales (confirmados)

- `rlc48-Reyes-LLavador` (admin)
- `pablo-rodes` (admin)
- `reml2` (admin — invitación pendiente)

---

## 15. Próximos Pasos Recomendados

1. **Ampliar rutas backend:** Crea rutas en `server/index.js` para films, usuarios, etc.
2. **Diseñar componentes frontend:** Agrega componentes en `client/src/` (FilmList, FilmCard, etc.)
3. **Conectar frontend ↔ backend:** Usa `fetch()` en componentes React para llamar a `/api`
4. **Autenticación:** Integra Supabase Auth si necesitas login de usuarios
5. **Base de datos:** Configura tablas en Supabase (films, users, reviews, etc.)
6. **Despliegue:** Cuando esté listo, despliega en Hetzner siguiendo sección 11

---

## 16. Recursos Útiles

- [React 19 Docs](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Getting Started](https://supabase.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Git Workflow](https://git-scm.com/book/en/v2)

---

_Guía actualizada el 12 de marzo de 2026._
_Stack: React 19 + Vite (frontend) × Express 5 (backend) × Supabase (BD) × Hetzner VPS (producción)._