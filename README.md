# Carrito API - Backend

API REST construida con NestJS para gestionar productos y carrito de compras.

## Descripción

Backend que proporciona endpoints para:
- Gestión de usuarios (CRUD)
- Consulta de productos desde API externa (dummyjson.com)
- Carrito de compras con validación de stock en tiempo real

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **yarn**
- **MySQL** 8.0 o superior

## Instalación

```bash
# Clonar el repositorio
cd carrito-api

# Instalar dependencias
npm install
```

## Configuración

1. Crear la base de datos MySQL:

```sql
CREATE DATABASE carrito_db;
```

2. Configurar las variables de entorno creando el archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=carrito_db

# Modo de ejecución
NODE_ENV=development

# API Externa de productos (opcional, tiene valores por defecto)
EXTERNAL_API_URL=https://dummyjson.com
```

## Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Semillas (Seed)
Para crear usuarios de prueba en la base de datos:
```bash
npm run seed
```

## Endpoints API

La API está disponible en: `http://localhost:3000/api`

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear usuario |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products?page=1&limit=15` | Listar productos (paginados) |

**Parámetros de consulta:**
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 15): Cantidad de items por página

### Carrito

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/cart?userId=1` | Obtener carrito del usuario |
| POST | `/cart/add` | Agregar producto al carrito |
| PATCH | `/cart/:itemId` | Actualizar cantidad de un item |
| DELETE | `/cart/:itemId?userId=1` | Eliminar item del carrito |

#### Ejemplo: Agregar al Carrito
```bash
POST http://localhost:3000/api/cart/add
Content-Type: application/json

{
  "idUsuario": 1,
  "idProducto": 1,
  "sku": "SKU123ABC",
  "precio": 29.99,
  "cantidad": 2,
  "imagen": "https://cdn.example.com/product.jpg"
}
```

#### Ejemplo: Actualizar Cantidad
```bash
PATCH http://localhost:3000/api/cart/1
Content-Type: application/json

{
  "cantidad": 5,
  "idUsuario": 1
}
```

## Validación de Stock

El backend valida automáticamente el stock disponible:
- Al agregar productos al carrito
- Al actualizar la cantidad de un producto

Si la cantidad solicitada supera el stock disponible, retorna un error 400.

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts              # Módulo principal
├── common/
│   ├── constants/             # Constantes globales
│   ├── filters/               # Filtros de excepciones HTTP
│   ├── interceptors/          # Interceptores de respuestas
│   └── utils/                 # Utilidades (ej: matemáticas)
├── users/
│   ├── dto/                   # Data Transfer Objects
│   ├── entities/              # Entidades TypeORM
│   ├── users.controller.ts    # Controlador
│   └── users.service.ts       # Lógica de negocio
├── products/
│   ├── dto/                   # DTOs para productos
│   ├── products.controller.ts # Controlador
│   └── products.service.ts    # Consumo de API externa
└── cart/
    ├── dto/                   # DTOs para carrito
    ├── entities/              # Entidades Order y OrderItem
    ├── cart.controller.ts     # Controlador
    └── cart.service.ts        # Lógica de negocio del carrito
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Iniciar en modo producción |
| `npm run start:dev` | Iniciar en modo desarrollo (hot-reload) |
| `npm run build` | Compilar TypeScript para producción |
| `npm run seed` | Ejecutar semillas de base de datos |
| `npm run lint` | Verificar código con ESLint |
| `npm run test` | Ejecutar pruebas unitarias |

## Tecnologías

- **NestJS** - Framework de backend
- **TypeORM** - ORM para MySQL
- **Axios** - Cliente HTTP para API externa
- **class-validator** - Validación de DTOs
- **MySQL** - Base de datos
