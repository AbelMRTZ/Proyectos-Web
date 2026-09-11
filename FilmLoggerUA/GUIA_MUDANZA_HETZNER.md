# Guia completa para mudar FilmLoggerUA a Hetzner

## Objetivo
Esta guia describe un flujo de trabajo donde:

- Localhost sigue siendo tu entorno principal de desarrollo y pruebas.
- Hetzner se usa solo para publicar la version final.
- No hay despliegue automatico en cada cambio.

## Arquitectura recomendada

- Frontend React/Vite servido por Apache2 como archivos estaticos.
- Backend Node/Express ejecutado con systemd.
- Apache2 hace proxy de /api hacia Node en localhost:5000.
- HTTP por IP publica (HTTPS opcional sin DNS, con certificado autofirmado).

Resultado final:

- http://IP_PUBLICA_VPS carga el frontend.
- http://IP_PUBLICA_VPS/api/... llega al backend.

## Fase 0: preparacion de codigo para multi-entorno

Antes de subir a Hetzner, ajusta el frontend para no usar URL fija de localhost en produccion.

### 0.1 Cambiar endpoint hardcodeado en Home.jsx

Archivo actual con endpoint fijo:

- client/src/pages/Home.jsx

Hoy usa:

- http://localhost:5000/api/films

Debes cambiarlo por una variable de entorno de Vite.

Ejemplo recomendado:

```jsx
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const res = await fetch(`${API_BASE}/api/films`);
```

Con esto:

- En local puedes usar VITE_API_URL=http://localhost:5000
- En produccion puedes usar VITE_API_URL vacio o /api

Nota: para evitar problemas de doble slash, usa exactamente los valores sugeridos en la seccion de .env.

### 0.2 Variables de entorno del frontend

Crea o ajusta estos archivos:

- client/.env.local
- client/.env.production

Contenido sugerido:

client/.env.local

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

client/.env.production

```env
VITE_API_URL=
VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

Por que VITE_API_URL vacio en produccion:

- Si el frontend y backend cuelgan de la misma IP publica, el fetch quedara como /api/films.
- Eso permite que Apache2 enrute internamente al backend sin CORS complejo.

### 0.3 Variables de entorno del backend

Tu backend ya usa CLIENT_URL para CORS. Mantener esto:

- En local: CLIENT_URL=http://localhost:5173
- En produccion: CLIENT_URL=http://IP_PUBLICA_VPS

Ejemplo de server/.env en produccion:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=http://IP_PUBLICA_VPS
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

## Fase 1: seguridad antes de publicar

Actualmente hay una SERVICE ROLE KEY en el repositorio local. Recomendaciones:

1. Rotar esa clave en Supabase antes de publicar.
2. No subir archivos .env al repositorio.
3. Guardar secretos solo en el servidor (archivo server/.env).

## Fase 2: preparar servidor Hetzner

Esta guia asume Ubuntu 22.04 o 24.04.

## 2.1 Crear VPS (sin DNS)

1. Crea una instancia en Hetzner Cloud.
2. Asigna IP publica.
3. Guarda esa IP publica, la usaras directamente en navegador.

## 2.2 Conectarte con Bitvise

En Bitvise:

1. Host: IP del VPS.
2. Port: 22.
3. Username: root (o usuario creado).
4. Authentication: password o key.
5. Login.

Usaras:

- Terminal SSH para comandos.
- SFTP solo si quieres mover archivos manualmente.

## 2.3 Endurecer servidor y paquetes base

En terminal SSH:

```bash
apt update
apt upgrade -y
apt install -y git apache2 ufw curl
ufw allow OpenSSH
ufw allow 'Apache Full'
ufw --force enable
```

## 2.4 Instalar Node LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs build-essential
node -v
npm -v
```

## Fase 3: subir proyecto a Hetzner

Tienes dos opciones. Recomendada: Git clone.

### Opcion A (recomendada): clonar desde GitHub

```bash
mkdir -p /var/www/filmlogger
cd /var/www/filmlogger
git clone https://github.com/AbelMRTZ/FilmLoggerUA.git
cd FilmLoggerUA
```

### Opcion B: subir por Bitvise SFTP

1. En Bitvise abre SFTP.
2. Sube carpeta del proyecto a /var/www/filmlogger/FilmLoggerUA.
3. Verifica permisos y estructura.

## Fase 4: instalar dependencias y compilar frontend

```bash
cd /var/www/filmlogger/FilmLoggerUA/server
npm ci

cd /var/www/filmlogger/FilmLoggerUA/client
npm ci
npm run build
```

El build final queda en:

- /var/www/filmlogger/FilmLoggerUA/client/dist

## Fase 5: configurar backend como servicio (systemd)

Crear archivo:

- /etc/systemd/system/filmlogger-api.service

Contenido:

```ini
[Unit]
Description=FilmLogger API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/filmlogger/FilmLoggerUA/server
EnvironmentFile=/var/www/filmlogger/FilmLoggerUA/server/.env
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Activar y arrancar:

```bash
systemctl daemon-reload
systemctl enable filmlogger-api
systemctl start filmlogger-api
systemctl status filmlogger-api
```

## Fase 6: configurar Apache2 (frontend + proxy api)

Crear archivo:

- /etc/apache2/sites-available/filmlogger.conf

Contenido:

```apache
<VirtualHost *:80>
   ServerName IP_PUBLICA_VPS

   DocumentRoot /var/www/filmlogger/FilmLoggerUA/client/dist

   <Directory /var/www/filmlogger/FilmLoggerUA/client/dist>
      Options FollowSymLinks
      AllowOverride All
      Require all granted
   </Directory>

   ProxyPreserveHost On
   ProxyPass /api/ http://127.0.0.1:5000/api/
   ProxyPassReverse /api/ http://127.0.0.1:5000/api/

   ErrorLog ${APACHE_LOG_DIR}/filmlogger-error.log
   CustomLog ${APACHE_LOG_DIR}/filmlogger-access.log combined
</VirtualHost>
```

Activar sitio:

```bash
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
a2ensite filmlogger.conf
a2dissite 000-default.conf
apache2ctl configtest
systemctl reload apache2
```

## Fase 7: habilitar HTTPS

Sin DNS, Let's Encrypt no puede emitir certificado para una IP publica.

Opciones reales:

1. Usar solo HTTP por IP (simple y suficiente para pruebas finales internas).
2. Usar HTTPS con certificado autofirmado (el navegador mostrara advertencia).

### Opcion A (recomendada sin DNS): mantener HTTP

No ejecutes Certbot. Tu app quedara accesible en:

- http://IP_PUBLICA_VPS
- http://IP_PUBLICA_VPS/api/health

### Opcion B (opcional): HTTPS autofirmado

```bash
apt install -y openssl
a2enmod ssl
mkdir -p /etc/ssl/filmlogger
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/filmlogger/filmlogger.key -out /etc/ssl/filmlogger/filmlogger.crt -subj "/CN=IP_PUBLICA_VPS"
```

Crear archivo:

- /etc/apache2/sites-available/filmlogger-ssl.conf

Contenido:

```apache
<VirtualHost *:443>
   ServerName IP_PUBLICA_VPS

   DocumentRoot /var/www/filmlogger/FilmLoggerUA/client/dist

   SSLEngine on
   SSLCertificateFile /etc/ssl/filmlogger/filmlogger.crt
   SSLCertificateKeyFile /etc/ssl/filmlogger/filmlogger.key

   <Directory /var/www/filmlogger/FilmLoggerUA/client/dist>
      Options FollowSymLinks
      AllowOverride All
      Require all granted
   </Directory>

   ProxyPreserveHost On
   ProxyPass /api/ http://127.0.0.1:5000/api/
   ProxyPassReverse /api/ http://127.0.0.1:5000/api/

   ErrorLog ${APACHE_LOG_DIR}/filmlogger-ssl-error.log
   CustomLog ${APACHE_LOG_DIR}/filmlogger-ssl-access.log combined
</VirtualHost>
```

Activar sitio SSL:

```bash
a2ensite filmlogger-ssl.conf
apache2ctl configtest
systemctl reload apache2
```

Prueba final:

- http://IP_PUBLICA_VPS
- http://IP_PUBLICA_VPS/api/health

## Fase 8: flujo de trabajo recomendado (localhost y version final)

### Desarrollo diario (localhost)

Usa siempre local para desarrollar:

1. Levantar backend local (server): npm run dev
2. Levantar frontend local (client): npm run dev
3. Probar cambios en http://localhost:5173

No tocar Hetzner en cada commit.

### Publicacion de version final en Hetzner (manual)

Cuando decidas publicar una version final:

1. Hacer commit y push final a main.
2. Entrar al VPS por Bitvise SSH.
3. Ejecutar:

```bash
cd /var/www/filmlogger/FilmLoggerUA
git pull origin main

cd client
npm ci
npm run build

cd ../server
npm ci

systemctl restart filmlogger-api
systemctl reload apache2
```

4. Validar en navegador y endpoint health.

### 8.1 Comandos para actualizar el repositorio en el servidor

Usa este bloque cada vez que quieras subir al servidor una nueva version final desde GitHub.

Comandos base (actualizacion completa):

```bash
cd /var/www/filmlogger/FilmLoggerUA
git fetch origin
git checkout main
git pull origin main

cd client
npm ci
npm run build

cd ../server
npm ci

systemctl restart filmlogger-api
systemctl reload apache2
```

Verificacion rapida despues del despliegue:

```bash
systemctl status filmlogger-api --no-pager
apache2ctl configtest
curl http://127.0.0.1:5000/api/health
```

Si solo cambiaste backend:

```bash
cd /var/www/filmlogger/FilmLoggerUA
git fetch origin
git checkout main
git pull origin main

cd server
npm ci
systemctl restart filmlogger-api
```

Si solo cambiaste frontend:

```bash
cd /var/www/filmlogger/FilmLoggerUA
git fetch origin
git checkout main
git pull origin main

cd client
npm ci
npm run build

systemctl reload apache2
```

Si git pull falla por cambios locales en el VPS:

```bash
cd /var/www/filmlogger/FilmLoggerUA
git status
```

Si aparecen archivos modificados por error en el servidor, no trabajes directamente ahi. Lleva esos cambios a tu repo local, subelos a GitHub y luego vuelve a ejecutar el flujo de actualizacion completa.

## Fase 9: mantenimiento y troubleshooting

## 9.1 Ver logs

```bash
journalctl -u filmlogger-api -f
tail -f /var/log/apache2/filmlogger-error.log
```

## 9.2 Comandos utiles

```bash
systemctl restart filmlogger-api
systemctl status filmlogger-api
apache2ctl configtest
systemctl reload apache2
```

## 9.3 Errores comunes

1. CORS bloqueado:
   - Revisar CLIENT_URL en server/.env.
2. Frontend no llama API correcta:
   - Revisar VITE_API_URL y recompilar con npm run build.
3. 502 Bad Gateway en Apache2:
   - Backend caido o puerto incorrecto.
4. Cambios no visibles:
   - Faltou correr npm run build en client.

## Checklist final

Antes de considerar la mudanza terminada:

1. Frontend local funciona en localhost.
2. Backend local funciona en localhost.
3. Endpoint hardcodeado de localhost removido del frontend.
4. Variables .env.local y .env.production definidas.
5. Backend en Hetzner corriendo con systemd.
6. Apache2 sirviendo frontend y proxy de /api.
7. Si usas SSL autofirmado, HTTPS activo (opcional).
8. /api/health responde en la IP publica.
9. Claves sensibles no expuestas en repositorio.

---

Si quieres, el siguiente paso puede ser crear una segunda guia corta de tipo runbook (10 comandos maximos) solo para publicar version final en Hetzner en 2 minutos.