# Carrito API

REST API para simulación de carrito de compras con NestJS.

## Requisitos

- Node.js >= 18
- MySQL 8.0+
- npm o yarn

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Editar `.env` con tu configuración de MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=carrito_db
PORT=3000
NODE_ENV=development
EXTERNAL_API_URL=https://dummyjson.com
```

3. Crear la base de datos en MySQL:
```sql
CREATE DATABASE carrito_db;
```

## Ejecución

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Probar Endpoints con Postman

### Productos
```
GET http://localhost:3000/api/products
```

### Carrito
```
GET    http://localhost:3000/api/cart
POST   http://localhost:3000/api/cart/add
DELETE http://localhost:3000/api/cart/:itemId
```

### Usuarios
```
GET http://localhost:3000/api/users
```

## Tests

```bash
npm run test
```

## Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── cart/           # Módulo de carrito
├── common/         # Filtros, interceptors, utils
├── config/         # Configuración de BD y app
├── products/       # Módulo de productos
└── users/          # Módulo de usuarios
```
