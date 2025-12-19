# Sistema de Cálculo de Retención Estudiantil

API REST para analizar tasas de retención estudiantil basada en datos históricos de matrícula.

## Tabla de Contenidos

- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Definición y Cálculo de Retención](#lógica-de-cálculo-de-retención)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Estructura Principal del Proyecto](#estructura-principal-del-proyecto)

---

## Cómo Ejecutar el Proyecto

### Requisitos

- Node.js 20 o superior
- npm
- Archivo `data/output.json` con los datos de estudiantes

### Instalación y Ejecución Local

```bash
# 1. Navegar a la carpeta del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# (Por defecto: PORT=5000, API_PREFIX=api)

# 4. Copiar el archivo de datos demo. Debe estar en:
backend/data/output.json

# 5. Ejecutar con npm en modo desarrollo
npm run start:dev
```

La API estará disponible en: `http://localhost:5000/api`

---

## Lógica de Cálculo de Retención

### ¿Qué es la Retención Estudiantil?

La **retención estudiantil** mide el porcentaje de estudiantes que continúan matriculados en el año siguiente al de su admisión, en la misma carrera.

### Criterios de Cálculo

#### Matriculados Primera Vez
Son los estudiantes que cumplen **todos** estos criterios:
- `year_admision` = `year_estado` (se matricularon en su año de admisión)
- `cod_estado` = `'M'` (estado Matriculado)

#### Matriculados Año Siguiente
Son los estudiantes del grupo anterior que además cumplen:
- Tienen un registro en el año siguiente (`year_estado` = `year_admision + 1`)
- `cod_estado` = `'M'` (siguen matriculados)
- `cod_programa` = mismo programa original (misma carrera)

#### Tasa de Retención
```
Tasa de Retención = (Matriculados Año Siguiente / Matriculados Primera Vez)

Porcentaje de Retención: Tasa de Retencion × 100 (No es calculado por la API)
```

---

## Endpoints Disponibles

### Base URL
```
http://localhost:5000/api/retencion
```

### 1. Obtener Todos los Registros

**GET** `/api/retencion`

Retorna todos los registros de estudiantes con filtros opcionales (a continuación).

**Query Parameters:**
- `from` (opcional): Año inicial (ej: `2010`)
- `to` (opcional): Año final (ej: `2020`)
- `cod_estado` (opcional): Filtrar por estado (ej: `M`, `E`)
- `cod_admision` (opcional): Filtrar por tipo de admisión
- `cod_programa` (opcional): Filtrar por código de carrera (ej: `8003`)

**Ejemplo:**
```bash
GET /api/retencion?from=2014&to=2015&cod_programa=8683&cod_estado=E
```

**Nota:** Este endpoint puede retornar muchos datos, por lo que aveces se puede caer en el navegador.

---

### 2. Resumen de Retención General

**GET** `/api/retencion/resumen`

Retorna tasas de retención agrupadas por año (todas las carreras combinadas).

**Query Parameters:**
- `from` (opcional): Año inicial
- `to` (opcional): Año final
- `cod_admision` (opcional): Filtrar por tipo de admisión

**Ejemplo:**
```bash
GET /api/retencion/resumen?from=2015&to=2020
```

**Respuesta:**
```json
[
  {
    "year": "2015",
    "matriculados_primera_vez": 2429,
    "matriculados_anio_siguiente": 1825,
    "tasa_retencion": 0.75
  },
  {
    "year": "2016",
    "matriculados_primera_vez": 2511,
    "matriculados_anio_siguiente": 1930,
    "tasa_retencion": 0.77
  },
  ...
]
```

---

### 3. Resumen de Retención por Carrera

**GET** `/api/retencion/resumen/carreras`

Retorna tasas de retención agrupadas por año y carrera.

**Query Parameters:**
- `from` (opcional): Año inicial
- `to` (opcional): Año final
- `cod_admision` (opcional): Filtrar por tipo de admisión
- `cod_programa` (opcional): Filtrar por carrera específica (ej: `8683`)

**Ejemplo:**
```bash
GET /api/retencion/resumen/carreras?cod_programa=8683
```

**Respuesta:**
```json
[
  {
    "year": "2011",
    "matriculados_primera_vez": 71,
    "matriculados_anio_siguiente": 50,
    "tasa_retencion": 0.7,
    "cod_programa": "8683",
    "nombre_programa": "INGENIERÍA CIVIL METALÚRGICA"
  },
  {
    "year": "2012",
    "matriculados_primera_vez": 80,
    "matriculados_anio_siguiente": 55,
    "tasa_retencion": 0.69,
    "cod_programa": "8683",
    "nombre_programa": "INGENIERÍA CIVIL METALÚRGICA"
  },
  ...
]
```

---

### 4. Listado de Carreras

**GET** `/api/retencion/carreras`

Retorna el listado de todas las carreras disponibles en el sistema (útil para filtros en frontend).

**Endpoint:**
```bash
GET /api/retencion/carreras
```

**Respuesta:**
```json
[
  {
    "cod_programa": "8453",
    "nombre_estandar": "ANALISTA QUIMICO"
  },
  {
    "cod_programa": "8213",
    "nombre_estandar": "ARQUITECTURA"
  },
  ...
]
```

---

## Estructura Principal del Proyecto

```
backend/
├── src/
│   ├── app.module.ts              # Módulo principal
│   ├── main.ts
│   ├── database/                  # Capa de acceso a datos
│   │   ├── database.module.ts
│   │   └── repositories/
│   │       └── json-student-status.repository.ts
│   └── retencion/                 # Módulo de retención
│       ├── retencion.module.ts
│       ├── retencion.controller.ts   # Endpoints REST
│       ├── retencion.service.ts      # Lógica de negocio
│       └── interfaces/
│           └── student-status.repository.ts
├── data/
│   └── output.json                # Datos demo (NO en el repo)

```
