# Elemento Náutico 🌊

Plataforma de información marítima en tiempo real para capitanes de embarcación, tripulación y usuarios de embarcaciones recreacionales.

## Características

- 🌬️ **Datos de Viento en Tiempo Real** - Velocidad, dirección y rachas
- 🌊 **Condiciones del Oleaje** - Altura, período y dirección de olas
- 🌀 **Corrientes Marinas** - Velocidad y dirección de corrientes
- 🕐 **Cambios de Mareas** - Predicciones precisas de mareas
- 🌡️ **Condiciones Climáticas** - Temperatura, presión, precipitación
- 📍 **Búsqueda por Ubicación** - Coordenadas o nombre de zona
- 🗺️ **Mapa Interactivo** - Visualización de capas marinas

## Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** para build rápido
- **Leaflet** + **Windy API** para mapas
- **Tailwind CSS** para estilos
- **Zustand** para estado global

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** para base de datos
- **Windy API** para datos climáticos
- **Tide API** para mareas

## Requisitos Previos

- Node.js 18+
- PostgreSQL 12+
- Docker (opcional)
- API Keys:
  - [Windy API Key](https://api.windy.com/)
  - [Tide API Key](https://www.tides.noaa.gov/api/)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/DavoAyala/ElementoNautico.git
cd ElementoNautico
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
cp .env.example .env
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 4. Configurar variables de entorno

**Backend (.env)**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/elemento_nautico
WINDY_API_KEY=your_windy_api_key
TIDE_API_KEY=your_tide_api_key
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_WINDY_API_KEY=your_windy_api_key
```

## Desarrollo

### Ejecutar Backend

```bash
cd backend
npm run dev
```

### Ejecutar Frontend

```bash
cd frontend
npm run dev
```

El aplicativo estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
ElementoNautico/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── routes/          # Definición de rutas
│   │   ├── models/          # Modelos de BD
│   │   ├── middleware/      # Middleware custom
│   │   └── index.ts         # Entrada principal
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios API
│   │   ├── stores/          # Estado global (Zustand)
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
└── docker-compose.yml
```

## API Endpoints

### Datos Climáticos
- `GET /api/weather/current?lat=&lon=` - Condiciones actuales
- `GET /api/weather/forecast?lat=&lon=` - Pronóstico

### Mareas
- `GET /api/tides/current?lat=&lon=` - Mareas actuales
- `GET /api/tides/prediction?lat=&lon=&days=` - Predicción de mareas

### Ubicaciones
- `GET /api/locations/search?query=` - Buscar ubicación
- `GET /api/locations/:id` - Detalles de ubicación

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Soporte

Para reportar bugs o solicitar features, abre un [Issue](https://github.com/DavoAyala/ElementoNautico/issues).

---

**Elemento Náutico** - Información Marítima Confiable para Navegantes 🌊
