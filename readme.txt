================================================================================
  CONSULODONTOLOGICO — DOCUMENTACIÓN DEL BACKEND
  Generado: Abril 2026
================================================================================

================================================================================
  1. RESEÑA DEL PROYECTO
================================================================================

ConsulOdontológico es una aplicación web de gestión para consultorios dentales.
Permite administrar pacientes, obras sociales, prestaciones, turnos (agenda) e
historial clínico de cada paciente.

El sistema está diseñado para uso interno del consultorio: el personal puede
registrar nuevos pacientes, asignarles una obra social con su nomenclador propio,
agendar turnos, registrar las prestaciones realizadas y llevar un historial
clínico completo por paciente, incluyendo un odontograma interactivo.

La arquitectura sigue el patrón de capas:
  - Routes    → define los endpoints HTTP
  - Controllers → recibe el request y llama al servicio
  - Services  → lógica de negocio y consultas a la base de datos
  - Models    → esquemas Mongoose (MongoDB)
  - Middlewares → manejo global de errores y captura de excepciones async

================================================================================
  2. TECNOLOGÍA UTILIZADA
================================================================================

  Runtime:       Node.js
  Framework:     Express 4.x
  Base de datos: MongoDB Atlas por Mongoose 8.x
  Variables env: dotenv
  CORS:          configurado local y abierto
  Desarrollo:    nodemon (hot-reload automático)

  Puerto por defecto:  5001
  Variable de entorno: MONGO_URI (string de conexión a MongoDB Atlas)

  Estructura de carpetas del backend:
  ─────────────────────────────────
  backend/
  ├── src/
  │   ├── index.js              ← Punto de entrada, conexión DB, montaje de rutas, cors
  │   ├── models/               ← Esquemas Mongoose
  │   │   ├── Paciente.js
  │   │   ├── ObraSocial.js
  │   │   ├── Prestacion.js
  │   │   ├── Agenda.js
  │   │   └── Historial.js
  │   ├── controllers/          ← Lógica de cada endpoint
  │   │   ├── PacienteController.js
  │   │   ├── ObrasocialController.js
  │   │   ├── PrestacionController.js
  │   │   ├── AgendaController.js
  │   │   └── HistorialController.js
  │   ├── routes/               ← Definición de rutas
  │   │   ├── PacienteRoutes.js
  │   │   ├── ObrasocialRoutes.js
  │   │   ├── PrestacionRoutes.js
  │   │   ├── AgendaRoutes.js
  │   │   └── HistorialRoutes.js
  │   ├── services/             ← Consultas a la DB y reglas de negocio
  │   │   ├── PacienteService.js
  │   │   ├── ObraSocialService.js
  │   │   ├── PrestacionService.js
  │   │   ├── AgendaService.js
  │   │   └── HistorialService.js
  │   ├── middlewares/
  │   │   ├── catchAsync.js     ← Wrapper para evitar try/catch repetitivo
  │   │   └── errorHandler.js   ← Manejador global de errores
  │   └── utils/
  │       └── AppError.js       ← Clase de error operacional personalizada
  └── package.json


================================================================================
  3. MODELOS — ESTRUCTURA Y EJEMPLO DE ALTA
================================================================================

--------------------------------------------------------------------------------
  3.1 PRESTACION
  Colección: prestaciones
  Descripción: Catálogo de prácticas odontológicas genéricas del consultorio.
               Debe cargarse primero ya que ObraSocial y Historial la referencian.
--------------------------------------------------------------------------------

  CAMPOS:
    nombre         String   Obligatorio. Se guarda en MAYÚSCULAS.
    valorParticular Number  Precio para pacientes sin obra social. Default: 0.
    activo         Boolean  Borrado lógico. Default: true.
    createdAt      Date     Automático (timestamps).
    updatedAt      Date     Automático (timestamps).

  EJEMPLO DE ALTA (POST /api/prestaciones):
  ------------------------------------------
  {
    "nombre": "Limpieza Dental",
    "valorParticular": 15000
  }

  RESPUESTA ESPERADA (201 Created):
  {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "nombre": "LIMPIEZA DENTAL",
    "valorParticular": 15000,
    "activo": true,
    "createdAt": "2026-04-16T20:00:00.000Z",
    "updatedAt": "2026-04-16T20:00:00.000Z"
  }


--------------------------------------------------------------------------------
  3.2 OBRA SOCIAL
  Colección: obrasocials
  Descripción: Convenios de obras sociales con su nomenclador propio.
               Cada item del nomenclador mapea una Prestacion al código y valor
               que aplica esa obra social.
               Prerequisito: las Prestaciones ya deben existir.
--------------------------------------------------------------------------------

  CAMPOS:
    razonSocial  String   Obligatorio. Se guarda en MAYÚSCULAS.
    plan         String   Obligatorio. Plan específico (ej: "210", "GOLD").
    nomenclador  Array    Lista de { prestacion (ref), codigoPropio, valorConvenio }.
      └── prestacion    ObjectId → Prestacion
      └── codigoPropio  String   Código que exige la OS en sus formularios.
      └── valorConvenio Number   Lo que la OS abona al consultorio por esa práctica.
    activo       Boolean  Borrado lógico. Default: true.
    createdAt    Date     Automático.
    updatedAt    Date     Automático.

  EJEMPLO DE ALTA (POST /api/obras-sociales):
  --------------------------------------------
  {
    "razonSocial": "OSDE",
    "plan": "210",
    "nomenclador": [
      {
        "prestacion": "664a1b2c3d4e5f6a7b8c9d0e",
        "codigoPropio": "0101",
        "valorConvenio": 12000
      },
      {
        "prestacion": "664a1b2c3d4e5f6a7b8c9d0f",
        "codigoPropio": "0205",
        "valorConvenio": 8500
      }
    ]
  }

  RESPUESTA ESPERADA (201 Created):
  {
    "_id": "664b2c3d4e5f6a7b8c9d0e1f",
    "razonSocial": "OSDE",
    "plan": "210",
    "nomenclador": [...],
    "activo": true,
    "createdAt": "2026-04-16T20:01:00.000Z",
    "updatedAt": "2026-04-16T20:01:00.000Z"
  }


--------------------------------------------------------------------------------
  3.3 PACIENTE
  Colección: pacientes
  Descripción: Ficha del paciente. Incluye referencia a su obra social y
               un odontograma persistido como mapa de piezas dentales.
               Prerequisito: la ObraSocial ya debe existir (o dejar null).
--------------------------------------------------------------------------------

  CAMPOS:
    nombre       String    Obligatorio. Mín 2 caracteres. Se guarda en MAYÚSCULAS.
    apellido     String    Obligatorio. Mín 2 caracteres. Se guarda en MAYÚSCULAS.
    dni          String    Obligatorio. Único en la colección.
    celular      String    Opcional.
    email        String    Opcional. Se guarda en minúsculas.
    obraSocial   ObjectId  Referencia a ObraSocial. Null si es particular.
    odontograma  Map       Mapa { <nroPieza>: { superior, inferior, izquierda,
                                derecha, centro } } con valores "sano"/"caries"/
                           "restaurado". Default: {}.
    activo       Boolean   Borrado lógico. Default: true.
    createdAt    Date      Automático.
    updatedAt    Date      Automático.

  EJEMPLO DE ALTA — Paciente particular (POST /api/pacientes):
  -------------------------------------------------------------
  {
    "nombre": "Juan",
    "apellido": "García",
    "dni": "32456789",
    "celular": "11 55667788",
    "email": "juan.garcia@gmail.com",
    "obraSocial": null
  }

  EJEMPLO DE ALTA — Paciente con obra social:
  --------------------------------------------
  {
    "nombre": "María",
    "apellido": "López",
    "dni": "28901234",
    "celular": "11 44332211",
    "email": "maria.lopez@hotmail.com",
    "obraSocial": "664b2c3d4e5f6a7b8c9d0e1f"
  }

  RESPUESTA ESPERADA (201 Created):
  {
    "_id": "664c3d4e5f6a7b8c9d0e1f20",
    "nombre": "JUAN",
    "apellido": "GARCÍA",
    "dni": "32456789",
    "celular": "11 55667788",
    "email": "juan.garcia@gmail.com",
    "obraSocial": null,
    "odontograma": {},
    "activo": true,
    "createdAt": "2026-04-16T20:02:00.000Z",
    "updatedAt": "2026-04-16T20:02:00.000Z"
  }


--------------------------------------------------------------------------------
  3.4 AGENDA (Turno)
  Colección: agendas
  Descripción: Registro de turnos del consultorio. Incluye validación de
               solapamiento de horarios al crear o editar.
               Prerequisito: Paciente y Prestacion ya deben existir.
--------------------------------------------------------------------------------

  CAMPOS:
    paciente     ObjectId  Obligatorio. Referencia a Paciente.
    prestacion   ObjectId  Obligatorio. Referencia a Prestacion.
    start        Date      Obligatorio. Fecha y hora de inicio del turno.
    end          Date      Obligatorio. Fecha y hora de fin del turno.
    estado       String    Enum: PENDIENTE | CANCELADO | FINALIZADO.
                           Default: PENDIENTE.
    observaciones String   Opcional. Notas sobre el turno.
    createdAt    Date      Automático.
    updatedAt    Date      Automático.

  NOTA: El servicio valida que el nuevo horario no se superponga con otro
        turno que no esté CANCELADO.

  EJEMPLO DE ALTA (POST /api/agenda):
  -------------------------------------
  {
    "paciente": "664c3d4e5f6a7b8c9d0e1f20",
    "prestacion": "664a1b2c3d4e5f6a7b8c9d0e",
    "start": "2026-04-17T10:00:00.000Z",
    "end": "2026-04-17T10:30:00.000Z",
    "estado": "PENDIENTE"
  }

  RESPUESTA ESPERADA (201 Created):
  {
    "_id": "664d4e5f6a7b8c9d0e1f2031",
    "paciente": "664c3d4e5f6a7b8c9d0e1f20",
    "prestacion": "664a1b2c3d4e5f6a7b8c9d0e",
    "start": "2026-04-17T10:00:00.000Z",
    "end": "2026-04-17T10:30:00.000Z",
    "estado": "PENDIENTE",
    "observaciones": null,
    "createdAt": "2026-04-16T20:03:00.000Z",
    "updatedAt": "2026-04-16T20:03:00.000Z"
  }


--------------------------------------------------------------------------------
  3.5 HISTORIAL (Evolución Clínica)
  Colección: historials
  Descripción: Registro de prestaciones realizadas a un paciente.
               Cada evolución está vinculada a un turno y, al crearse,
               el turno correspondiente pasa automáticamente a FINALIZADO.
               Prerequisito: Paciente, Prestacion y Turno ya deben existir.
--------------------------------------------------------------------------------

  CAMPOS:
    paciente       ObjectId  Obligatorio. Referencia a Paciente.
    prestacion     ObjectId  Obligatorio. Referencia a Prestacion.
    obraSocial     ObjectId  Opcional. Referencia a ObraSocial (si aplica).
    turno          ObjectId  Referencia al turno (Agenda) asociado.
    codigoAplicado String    Código OS que se usó en esa evolución.
    valorAplicado  Number    Monto cobrado (particular o convenio).
    observaciones  String    Notas clínicas de la sesión.
    fechaRealizacion Date    Default: Date.now (automático).
    createdAt      Date      Automático.
    updatedAt      Date      Automático.

  NOTA: Al registrar una evolución, el backend actualiza automáticamente
        el estado del turno referenciado a FINALIZADO.

  EJEMPLO DE ALTA (POST /api/historial):
  ----------------------------------------
  {
    "pacienteId": "664c3d4e5f6a7b8c9d0e1f20",
    "prestacionId": "664a1b2c3d4e5f6a7b8c9d0e",
    "turnoId": "664d4e5f6a7b8c9d0e1f2031",
    "observaciones": "Se realizó limpieza completa. Sin caries activas."
  }

  RESPUESTA ESPERADA (201 Created):
  {
    "success": true,
    "data": {
      "_id": "664e5f6a7b8c9d0e1f203142",
      "paciente": "664c3d4e5f6a7b8c9d0e1f20",
      "prestacion": "664a1b2c3d4e5f6a7b8c9d0e",
      "turno": "664d4e5f6a7b8c9d0e1f2031",
      "observaciones": "Se realizó limpieza completa. Sin caries activas.",
      "fechaRealizacion": "2026-04-16T20:04:00.000Z",
      "createdAt": "2026-04-16T20:04:00.000Z",
      "updatedAt": "2026-04-16T20:04:00.000Z"
    }
  }


================================================================================
  4. REFERENCIA COMPLETA DE LA API — CRUD POR RECURSO
================================================================================

  BASE URL: http://localhost:5001/api
  (En producción reemplazar con la URL de Render)

--------------------------------------------------------------------------------
  4.1 PRESTACIONES — /api/prestaciones
--------------------------------------------------------------------------------

  MÉTODO  ENDPOINT              DESCRIPCIÓN
  ------  --------------------  ------------------------------------------------
  POST    /api/prestaciones      Crear nueva prestación
  GET     /api/prestaciones      Obtener todas las prestaciones
  PUT     /api/prestaciones/:id  Actualizar nombre o valor de una prestación
  PATCH   /api/prestaciones/:id/estado  Activar o desactivar (borrado lógico)
  DELETE  /api/prestaciones/:id  Eliminar definitivamente una prestación

  ─── PUT /api/prestaciones/:id ─────────────────────────────────────────────
  Body:
  {
    "nombre": "EXTRACCIÓN SIMPLE",
    "valorParticular": 20000
  }

  ─── PATCH /api/prestaciones/:id/estado ────────────────────────────────────
  Body:
  {
    "activo": false
  }


--------------------------------------------------------------------------------
  4.2 OBRAS SOCIALES — /api/obras-sociales
--------------------------------------------------------------------------------

  MÉTODO  ENDPOINT                        DESCRIPCIÓN
  ------  ------------------------------  --------------------------------------
  POST    /api/obras-sociales             Registrar nueva obra social
  GET     /api/obras-sociales             Obtener todas las obras sociales
  PUT     /api/obras-sociales/:id         Actualizar datos + nomenclador completo
  PATCH   /api/obras-sociales/:id/estado  Activar o desactivar (borrado lógico)

  ─── PUT /api/obras-sociales/:id ───────────────────────────────────────────
  Body (enviar el objeto completo con el nomenclador actualizado):
  {
    "razonSocial": "OSDE",
    "plan": "310",
    "nomenclador": [
      {
        "prestacion": "664a1b2c3d4e5f6a7b8c9d0e",
        "codigoPropio": "0101",
        "valorConvenio": 13500
      }
    ]
  }

  ─── PATCH /api/obras-sociales/:id/estado ──────────────────────────────────
  Body:
  {
    "activo": false
  }


--------------------------------------------------------------------------------
  4.3 PACIENTES — /api/pacientes
--------------------------------------------------------------------------------

  MÉTODO  ENDPOINT                     DESCRIPCIÓN
  ------  ---------------------------  -----------------------------------------
  POST    /api/pacientes               Registrar nuevo paciente
  GET     /api/pacientes               Obtener todos los pacientes
  GET     /api/pacientes?soloActivos=true  Solo pacientes activos
  GET     /api/pacientes/:id           Obtener un paciente por ID
  PUT     /api/pacientes/:id           Actualizar datos del paciente
  PATCH   /api/pacientes/:id/estado    Activar o desactivar (borrado lógico)

  ─── PUT /api/pacientes/:id ─────────────────────────────────────────────────
  Body (enviar solo los campos a modificar):
  {
    "celular": "11 99887766",
    "email": "nuevo.email@gmail.com",
    "obraSocial": "664b2c3d4e5f6a7b8c9d0e1f"
  }

  ─── PUT /api/pacientes/:id (actualizar odontograma) ────────────────────────
  Body:
  {
    "odontograma": {
      "11": { "superior": "caries", "inferior": "sano", "centro": "sano",
              "izquierda": "sano", "derecha": "restaurado" },
      "21": { "superior": "sano", "inferior": "sano", "centro": "caries",
              "izquierda": "sano", "derecha": "sano" }
    }
  }

  ─── PATCH /api/pacientes/:id/estado ────────────────────────────────────────
  Body:
  {
    "activo": false
  }


--------------------------------------------------------------------------------
  4.4 AGENDA (Turnos) — /api/agenda
--------------------------------------------------------------------------------

  MÉTODO  ENDPOINT                               DESCRIPCIÓN
  ------  -------------------------------------  --------------------------------
  POST    /api/agenda                            Registrar nuevo turno
  GET     /api/agenda                            Obtener todos los turnos
  PUT     /api/agenda/:id                        Actualizar turno (hora, estado)
  DELETE  /api/agenda/:id                        Eliminar turno definitivamente
  GET     /api/agenda/paciente/:id/pendientes    Turnos FINALIZADOS sin evolución

  NOTA IMPORTANTE: Al crear o editar, el servicio valida que el horario no
  se superponga con otro turno activo (no cancelado). Si hay solapamiento
  retorna un error 500 con mensaje: "El horario ya está ocupado por otro turno."

  ─── PUT /api/agenda/:id ───────────────────────────────────────────────────
  Body (ejemplo para cancelar un turno):
  {
    "estado": "CANCELADO"
  }

  Body (ejemplo para reprogramar):
  {
    "start": "2026-04-18T14:00:00.000Z",
    "end": "2026-04-18T14:30:00.000Z",
    "estado": "PENDIENTE"
  }

  GET /api/agenda/paciente/:id/pendientes
  → Devuelve los turnos en estado FINALIZADO del paciente que aún
    NO tienen una evolución en el historial. Se usa para cargar el
    selector de turnos al registrar una nueva evolución clínica.


--------------------------------------------------------------------------------
  4.5 HISTORIAL CLÍNICO — /api/historial
--------------------------------------------------------------------------------

  MÉTODO  ENDPOINT                        DESCRIPCIÓN
  ------  ------------------------------  --------------------------------------
  POST    /api/historial                  Registrar nueva evolución clínica
  GET     /api/historial/paciente/:id     Obtener historial completo del paciente

  NOTA: No existe endpoint de edición ni borrado del historial.
        Las evoluciones son registros permanentes.

  ─── GET /api/historial/paciente/:id ───────────────────────────────────────
  Devuelve el historial ordenado del más reciente al más antiguo.
  Cada item viene con la prestación populada (nombre, valorParticular).
  Ejemplo de respuesta:
  [
    {
      "_id": "664e5f6a...",
      "paciente": "664c3d4e...",
      "prestacion": {
        "_id": "664a1b2c...",
        "nombre": "LIMPIEZA DENTAL",
        "valorParticular": 15000
      },
      "turno": "664d4e5f...",
      "observaciones": "Sin novedades.",
      "fechaRealizacion": "2026-04-16T20:04:00.000Z"
    }
  ]


================================================================================
  5. MANEJO DE ERRORES
================================================================================

  El backend tiene un manejador global de errores (errorHandler.js).
  Todos los errores llegan a él a través del wrapper catchAsync.

  CÓDIGO  SITUACIÓN                       MENSAJE RETORNADO
  ------  ------------------------------  -------------------------------------
  400     Campos inválidos (Mongoose)     "Datos inválidos. [detalle]"
  400     Valor duplicado (DNI, etc.)     "El valor [x] ya existe. Use otro."
  400     ID de MongoDB malformado        "ID inválido: [campo]"
  400     Campo faltante (AppError)       Mensaje personalizado del controller
  404     Recurso no encontrado           "Paciente no encontrado" (u otro)
  500     Error interno no controlado     "Algo ha salido mal en el servidor."

  Formato de todos los errores:
  {
    "success": false,
    "message": "Descripción del error"
  }


================================================================================
  6. ORDEN RECOMENDADO DE CARGA INICIAL DE DATOS
================================================================================

  Para que el sistema funcione correctamente desde cero, respetar este orden:

  1. Cargar las PRESTACIONES (no tienen dependencias)
  2. Cargar las OBRAS SOCIALES (referencian Prestaciones en el nomenclador)
  3. Registrar los PACIENTES (referencian ObraSocial)
  4. Crear TURNOS en la AGENDA (referencian Paciente y Prestacion)
  5. Registrar EVOLUCIONES en el HISTORIAL (referencian Paciente, Prestacion y Turno)

================================================================================
  FIN DEL DOCUMENTO
================================================================================
