# 🥊 MMA Live System - Frontend Vue.js

Frontend moderno desarrollado con Vue.js 3 para consumir la API del sistema de gestión de peleas MMA.

## 📋 Características

- ✅ **Vue.js 3** con Composition API
- ✅ **Vue Router** para navegación
- ✅ **Pinia** para gestión de estado
- ✅ **Axios** para peticiones HTTP
- ✅ **WebSocket** (SockJS + STOMP) para actualizaciones en tiempo real
- ✅ **Autenticación JWT** con protección de rutas
- ✅ **Diseño responsivo** y moderno
- ✅ **Vistas públicas** y **paneles administrativos**

## 🚀 Instalación

### Requisitos

- Node.js 18+ (recomendado 20+)
- npm o yarn

### Pasos

1. **Instalar dependencias:**
```bash
cd frontend-vue
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo .env.example a .env (ya está configurado para desarrollo local)
# Editar .env si el backend está en otro puerto
```

3. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

4. **Compilar para producción:**
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_WS_BASE_URL=http://localhost:8081
```

Para producción, actualiza estas URLs con la dirección de tu backend.

## 📱 Estructura del Proyecto

```
frontend-vue/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   └── NavBar.vue
│   ├── config/            # Configuración
│   │   └── api.js
│   ├── router/            # Configuración de rutas
│   │   └── index.js
│   ├── services/          # Servicios API y WebSocket
│   │   ├── api.js
│   │   └── websocket.js
│   ├── stores/            # Stores de Pinia
│   │   ├── auth.js
│   │   ├── bouts.js
│   │   └── fighters.js
│   ├── views/             # Vistas/Páginas
│   │   ├── admin/         # Panel de administración
│   │   ├── judge/         # Panel del juez
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Fighters.vue
│   │   ├── Bouts.vue
│   │   └── ...
│   ├── App.vue
│   └── main.js
├── .env
├── package.json
└── vite.config.js
```

## 🔐 Autenticación

### Credenciales de Demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `juez1` | `juez123` | Juez |
| `juez2` | `juez123` | Juez |
| `juez3` | `juez123` | Juez |
| `supervisor` | `super123` | Supervisor |

### Flujo de Autenticación

1. El usuario inicia sesión en `/login`
2. El token JWT se almacena en `localStorage`
3. El token se incluye automáticamente en todas las peticiones HTTP
4. Las rutas protegidas verifican la autenticación y el rol del usuario
5. Si el token expira o es inválido, el usuario es redirigido al login

## 🌐 Rutas

### Públicas
- `/` - Página de inicio
- `/fighters` - Lista de peleadores
- `/fighters/:id` - Detalle de peleador
- `/bouts` - Lista de peleas
- `/bouts/live` - Peleas en vivo
- `/bouts/:id` - Detalle de pelea
- `/login` - Inicio de sesión

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard (Admin)
- `/admin/fighters` - Gestión de peleadores (Admin)
- `/admin/bouts` - Gestión de peleas (Admin)
- `/judge/bouts` - Panel del juez (Juez)

## 🔌 WebSocket

El frontend se conecta automáticamente al WebSocket cuando el usuario está autenticado. Las actualizaciones en tiempo real incluyen:

- Actualizaciones de estado de peleas
- Cambios de round
- Actualizaciones de puntuación
- Inicio/finalización de peleas

### Canales suscritos:
- `/topic/bouts` - Todas las peleas
- `/topic/bout/{id}` - Pelea específica
- `/topic/bout/{id}/scores` - Puntuaciones de una pelea

## 🎨 Características de UI

- Diseño moderno con gradientes y animaciones
- Indicadores visuales para peleas en vivo
- Cards interactivas con efectos hover
- Formularios con validación
- Modales para crear/editar recursos
- Responsive design para móviles y tablets

## 🔗 Integración con Backend

El frontend consume los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Públicos
- `GET /api/public/fighters` - Listar peleadores
- `GET /api/public/bouts` - Listar peleas
- `GET /api/public/bouts/live` - Peleas en vivo

### Admin
- `POST /api/admin/fighters` - Crear peleador
- `PUT /api/admin/fighters/{id}` - Actualizar peleador
- `DELETE /api/admin/fighters/{id}` - Eliminar peleador
- Similar para peleas

### Juez
- `POST /api/judge/bouts/{id}/start` - Iniciar pelea
- `POST /api/judge/bouts/{id}/pause` - Pausar pelea
- `POST /api/judge/bouts/{id}/resume` - Reanudar pelea
- `POST /api/judge/bouts/{id}/next-round` - Siguiente round
- `POST /api/judge/bouts/{id}/finish` - Finalizar pelea
- `POST /api/judge/bouts/{id}/score` - Enviar puntuación

## 🛠️ Tecnologías Utilizadas

- **Vue.js 3** - Framework JavaScript progresivo
- **Vite** - Build tool y dev server
- **Vue Router** - Router oficial de Vue
- **Pinia** - Store de estado oficial de Vue
- **Axios** - Cliente HTTP
- **SockJS** - Cliente WebSocket
- **STOMP.js** - Protocolo de mensajería sobre WebSocket

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 🐛 Solución de Problemas

### Error de CORS
Asegúrate de que el backend tenga CORS configurado para aceptar peticiones desde `http://localhost:5173`

### Error de conexión WebSocket
Verifica que:
1. El backend esté corriendo en el puerto correcto (8081)
2. La variable `VITE_WS_BASE_URL` esté correctamente configurada
3. El backend tenga WebSocket habilitado

### Error de autenticación
1. Verifica que el backend esté corriendo
2. Verifica las credenciales
3. Revisa la consola del navegador para ver errores de red

## 📞 Soporte

Para más información sobre el backend, consulta el archivo `INSTALACION.md` en la raíz del proyecto.

## 📄 Licencia

Este es un proyecto académico desarrollado para la Universidad de las Américas.
