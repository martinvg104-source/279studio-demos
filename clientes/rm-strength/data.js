/* RM Strength — configuración central de datos mock.
   Todo lo de aquí es demostración. Cuando el centro valide datos reales
   (horarios, plazas, precios, clientes), se sustituye solo en este archivo. */

var CLUB = {
  name: "RM Strength — Centro de Entrenamiento Personal",
  shortName: "RM Strength",
  address: "Praza da Bahía, 4, bajo, Mera – Serantes, 15173 Oleiros (A Coruña)",
  phone: "698 120 236",
  phoneHref: "+34698120236",
  instagram: "https://www.instagram.com/rm_strength_",
  email: "info@rmstrength.example.com",
  since: 2020,
  teacher: "Equipo RM Strength",
  philosophy: "Entrenamiento personal para salud, rendimiento y recuperación",
  notice: "Aviso del centro: quedan plazas en los grupos reducidos de esta semana (ejemplo de aviso)."
};

var NAV_ITEMS_ALUMNO = [
  { route: "inicio", label: "Inicio", icon: "home" },
  { route: "reservar", label: "Reservar", icon: "plus" },
  { route: "mis-reservas", label: "Mis sesiones", icon: "list" },
  { route: "actividades", label: "Servicios", icon: "grid" },
  { route: "avisos", label: "Avisos", icon: "bell", badgeKey: "avisos" },
  { route: "perfil", label: "Perfil", icon: "user" }
];

var NAV_ITEMS_ADMIN = [
  { route: "resumen", label: "Resumen", icon: "grid" },
  { route: "admin-reservas", label: "Reservas", icon: "list" },
  { route: "admin-calendario", label: "Calendario", icon: "calendar" },
  { route: "admin-alumnos", label: "Clientes", icon: "user" },
  { route: "admin-grupos", label: "Servicios y niveles", icon: "grid" },
  { route: "admin-avisos", label: "Avisos", icon: "bell" },
  { route: "admin-automatizaciones", label: "Automatizaciones", icon: "bolt" },
  { route: "admin-config", label: "Configuración", icon: "settings" }
];

/* Login de demostración: no hay backend ni autenticación real, solo dos
   pares fijos correo/contraseña para enseñar los dos roles de la app. */
var LOGIN_USERS = {
  admin: { password: "admin", role: "admin", name: "RM Strength" },
  cliente: { password: "cliente", role: "alumno", name: "Marta Souto" }
};

var ACTIVITIES = [
  { id: "individual", name: "Entrenamiento individual", what: "Sesión 1 a 1 con entrenador, plan adaptado a tu objetivo.", forWhom: "Pérdida de grasa, ganancia muscular, rendimiento o rehabilitación.", level: "Todos los niveles", duration: "60 min (ejemplo)", ageRange: "Adultos", availability: "Plazas disponibles", tipo: "individual" },
  { id: "grupo-reducido", name: "Grupo reducido", what: "Entrenamiento en grupo de 4 a 6 personas, mismo seguimiento cercano.", forWhom: "Quien prefiere entrenar acompañado sin perder atención personalizada.", level: "Todos los niveles", duration: "50 min (ejemplo)", ageRange: "Adultos", availability: "Plazas limitadas", tipo: "grupo" },
  { id: "equipo", name: "Entrenamiento de equipo", what: "Preparación física para plantillas y equipos deportivos.", forWhom: "Equipos y clubes que buscan trabajo físico específico.", level: "Rendimiento", duration: "75 min (ejemplo)", ageRange: "Deportistas", availability: "Consultar plazas", tipo: "equipo" },
  { id: "rehabilitacion", name: "Readaptación de lesiones", what: "Trabajo guiado de recuperación tras lesión, en coordinación con el cliente.", forWhom: "Personas en proceso de rehabilitación física.", level: "Iniciación", duration: "50 min (ejemplo)", ageRange: "Adultos", availability: "Plazas disponibles", tipo: "individual" }
];

var GROUPS = {
  "individual": ["Principiante", "Intermedio", "Avanzado"],
  "grupo-reducido": ["Principiante", "Intermedio", "Avanzado"],
  "equipo": ["Pretemporada", "Temporada", "Readaptación de equipo"],
  "rehabilitacion": ["Fase inicial", "Fase avanzada"]
};

/* Horario orientativo del centro; confirmar disponibilidad real con RM Strength. */
var SCHEDULE = [
  { activityId: "individual", days: ["Lunes", "Miércoles", "Viernes"], time: "09:00–10:00" },
  { activityId: "individual", days: ["Martes", "Jueves"], time: "17:00–18:00" },
  { activityId: "grupo-reducido", days: ["Lunes", "Miércoles", "Viernes"], time: "19:00–19:50" },
  { activityId: "grupo-reducido", days: ["Martes", "Jueves"], time: "20:00–20:50" },
  { activityId: "equipo", days: ["Martes", "Jueves"], time: "21:00–22:15" },
  { activityId: "rehabilitacion", days: ["Lunes", "Miércoles"], time: "11:00–11:50" }
];

var MY_RESERVATIONS = [
  { id: "RES-1042", activityId: "individual", group: "Intermedio", date: "2026-09-23", time: "17:00–18:00", student: "Marta Souto", status: "confirmada" },
  { id: "RES-1039", activityId: "grupo-reducido", group: "Intermedio", date: "2026-09-21", time: "20:00–20:50", student: "Marta Souto", status: "pendiente" },
  { id: "RES-0988", activityId: "rehabilitacion", group: "Fase avanzada", date: "2026-08-14", time: "11:00–11:50", student: "Marta Souto", status: "completada" },
  { id: "RES-0965", activityId: "individual", group: "Intermedio", date: "2026-07-30", time: "17:00–18:00", student: "Marta Souto", status: "cancelada" }
];

var PROFILE = {
  name: "Marta Souto",
  initials: "MS",
  isFamily: false,
  students: [
    { name: "Marta Souto", activity: "Entrenamiento individual", belt: "Objetivo: pérdida de grasa (dato simulado)" }
  ],
  phone: "600 12 34 56",
  email: "marta.souto@example.com",
  commsPrefs: ["WhatsApp", "Email"]
};

var AUTOMATIONS = [
  { id: "nueva-reserva", name: "Nueva reserva", steps: ["Reserva", "Ficha del cliente", "Aviso al centro", "Confirmación", "Recordatorio"], active: true },
  { id: "clase-prueba", name: "Sesión de valoración", steps: ["Sesión reservada", "Recordatorio 24h antes", "Registro de asistencia", "Seguimiento posterior"], active: true },
  { id: "no-asistencia", name: "No asistencia", steps: ["No presentado", "Mensaje amable", "Enlace para elegir otra fecha"], active: false },
  { id: "alumno-inactivo", name: "Cliente inactivo", steps: ["Sin actividad", "Segmento de antiguos clientes", "Check-in de reactivación", "Nueva reserva"], active: true },
  { id: "check-in-progreso", name: "Check-in de progreso (futuro)", steps: ["Sesión completada", "Recordatorio de check-in", "Actualización de objetivo"], active: false }
];

var ADMIN_ACTIVITY_FEED = [
  { text: "Nueva solicitud de sesión de valoración — Diego Castro", time: "hace 2 horas" },
  { text: "Reserva confirmada — Marta Souto, Entrenamiento individual", time: "hace 3 horas" },
  { text: "Iago Ferreiro canceló una sesión de grupo reducido", time: "ayer" },
  { text: "Aviso publicado: \"Plazas libres en grupo reducido\"", time: "ayer" },
  { text: "Sara Blanco marcada como pendiente de reactivación", time: "hace 2 días" }
];

var ADMIN_QUICK_ACTIONS = [
  { id: "crear-aviso", label: "Crear aviso", route: "admin-avisos" },
  { id: "anadir-alumno", label: "Añadir cliente", route: "admin-alumnos" },
  { id: "crear-reserva", label: "Crear reserva", route: "admin-reservas" },
  { id: "gestionar-horarios", label: "Gestionar horarios", route: "admin-calendario" },
  { id: "ver-hoy", label: "Ver sesiones de hoy", route: "admin-calendario" },
  { id: "revisar-solicitudes", label: "Revisar solicitudes", route: "admin-reservas" }
];

/* Ficha de clientes del centro (demo). "seguimiento" marca casos que el admin debe revisar. */
var STUDENTS = [
  { id: "AL-001", nombre: "Marta Souto", edad: 34, tutor: "", telefono: "600 12 34 56", email: "marta.souto@example.com", activityId: "individual", group: "Intermedio", nivel: "Objetivo: pérdida de grasa · en proceso (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-09", seguimiento: false, notas: ["Buena progresión en las últimas 4 semanas (nota interna, demo)."] },
  { id: "AL-002", nombre: "Diego Castro", edad: 29, tutor: "", telefono: "611 22 33 44", email: "diego.castro@example.com", activityId: "individual", group: "Principiante", nivel: "Objetivo: ganancia muscular · fase inicial (dato simulado)", estado: "activo", ultimaAsistencia: "2026-08-14", seguimiento: true, notas: ["Canceló su última sesión, pendiente de recontactar."] },
  { id: "AL-003", nombre: "Noa Pardo", edad: 41, tutor: "", telefono: "633 55 66 77", email: "noa.pardo@example.com", activityId: "rehabilitacion", group: "Fase avanzada", nivel: "Objetivo: rehabilitación de rodilla · fase avanzada (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-10", seguimiento: true, notas: ["Revisar evolución con fisioterapeuta de referencia."] },
  { id: "AL-004", nombre: "Sara Blanco", edad: 27, tutor: "", telefono: "644 66 77 88", email: "sara.blanco@example.com", activityId: "grupo-reducido", group: "Avanzado", nivel: "Objetivo: rendimiento · mantenimiento (dato simulado)", estado: "inactivo", ultimaAsistencia: "2026-05-20", seguimiento: true, notas: ["Inactiva desde hace 4 meses. Candidata a check-in de reactivación."] },
  { id: "AL-005", nombre: "Iago Ferreiro", edad: 16, tutor: "Familia Ferreiro", telefono: "666 88 99 00", email: "iago.ferreiro@example.com", activityId: "equipo", group: "Temporada", nivel: "Objetivo: rendimiento deportivo (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-08", seguimiento: false, notas: ["Forma parte del grupo de preparación física del equipo juvenil."] }
];

/* Accesos de cliente gestionados por el admin (demo, sin backend real). */
var ACCESSES = [
  { id: "ACC-01", nombre: "Marta Souto", email: "marta.souto@example.com", telefono: "600 12 34 56", studentId: "AL-001", tipo: "cliente", estado: "activo" },
  { id: "ACC-02", nombre: "Diego Castro", email: "diego.castro@example.com", telefono: "611 22 33 44", studentId: "AL-002", tipo: "cliente", estado: "activo" },
  { id: "ACC-03", nombre: "Noa Pardo", email: "noa.pardo@example.com", telefono: "633 55 66 77", studentId: "AL-003", tipo: "cliente", estado: "pendiente" },
  { id: "ACC-04", nombre: "Sara Blanco", email: "sara.blanco@example.com", telefono: "644 66 77 88", studentId: "AL-004", tipo: "cliente", estado: "bloqueado" },
  { id: "ACC-05", nombre: "Familia Ferreiro", email: "iago.ferreiro@example.com", telefono: "666 88 99 00", studentId: "AL-005", tipo: "familiar", estado: "activo" }
];

/* Calendario de sesiones gestionado por el admin (demo). Independiente del horario
   que ve el cliente en el wizard de reserva; aquí se puede crear/editar/eliminar. */
var ADMIN_CLASSES = [
  { id: "CLS-01", activityId: "individual", group: "Intermedio", day: "Lunes", timeStart: "09:00", timeEnd: "10:00", capacity: 1, occupied: 1, teacher: "Equipo RM Strength", location: "Sala 1", notes: "" },
  { id: "CLS-02", activityId: "individual", group: "Intermedio", day: "Miércoles", timeStart: "09:00", timeEnd: "10:00", capacity: 1, occupied: 1, teacher: "Equipo RM Strength", location: "Sala 1", notes: "" },
  { id: "CLS-03", activityId: "individual", group: "Principiante", day: "Martes", timeStart: "17:00", timeEnd: "18:00", capacity: 1, occupied: 1, teacher: "Equipo RM Strength", location: "Sala 1", notes: "" },
  { id: "CLS-04", activityId: "grupo-reducido", group: "Intermedio", day: "Lunes", timeStart: "19:00", timeEnd: "19:50", capacity: 6, occupied: 4, teacher: "Equipo RM Strength", location: "Sala principal", notes: "" },
  { id: "CLS-05", activityId: "grupo-reducido", group: "Intermedio", day: "Miércoles", timeStart: "19:00", timeEnd: "19:50", capacity: 6, occupied: 4, teacher: "Equipo RM Strength", location: "Sala principal", notes: "" },
  { id: "CLS-06", activityId: "grupo-reducido", group: "Avanzado", day: "Jueves", timeStart: "20:00", timeEnd: "20:50", capacity: 6, occupied: 5, teacher: "Equipo RM Strength", location: "Sala principal", notes: "" },
  { id: "CLS-07", activityId: "equipo", group: "Temporada", day: "Martes", timeStart: "21:00", timeEnd: "22:15", capacity: 16, occupied: 12, teacher: "Equipo RM Strength", location: "Sala principal", notes: "Preparación física de pretemporada (ejemplo)" },
  { id: "CLS-08", activityId: "equipo", group: "Temporada", day: "Jueves", timeStart: "21:00", timeEnd: "22:15", capacity: 16, occupied: 12, teacher: "Equipo RM Strength", location: "Sala principal", notes: "" },
  { id: "CLS-09", activityId: "rehabilitacion", group: "Fase avanzada", day: "Lunes", timeStart: "11:00", timeEnd: "11:50", capacity: 1, occupied: 1, teacher: "Equipo RM Strength", location: "Sala 2", notes: "" },
  { id: "CLS-10", activityId: "rehabilitacion", group: "Fase inicial", day: "Miércoles", timeStart: "11:00", timeEnd: "11:50", capacity: 1, occupied: 0, teacher: "Equipo RM Strength", location: "Sala 2", notes: "" }
];

/* Vista global de reservas para el panel de administración (demo). Distinta de
   MY_RESERVATIONS, que es solo la cuenta de cliente de demostración. */
var ADMIN_RESERVATIONS = [
  { id: "RES-2041", activityId: "individual", group: "Principiante", date: "2026-09-16", time: "17:00–18:00", student: "Diego Castro", phone: "611 22 33 44", status: "pendiente", trial: true },
  { id: "RES-2038", activityId: "individual", group: "Intermedio", date: "2026-09-16", time: "09:00–10:00", student: "Marta Souto", phone: "600 12 34 56", status: "confirmada", trial: false },
  { id: "RES-2035", activityId: "rehabilitacion", group: "Fase inicial", date: "2026-09-17", time: "11:00–11:50", student: "Noa Pardo", phone: "633 55 66 77", status: "pendiente", trial: true },
  { id: "RES-2030", activityId: "equipo", group: "Temporada", date: "2026-09-17", time: "21:00–22:15", student: "Iago Ferreiro", phone: "666 88 99 00", status: "confirmada", trial: false },
  { id: "RES-2028", activityId: "grupo-reducido", group: "Avanzado", date: "2026-09-10", time: "20:00–20:50", student: "Sara Blanco", phone: "644 66 77 88", status: "no-asistio", trial: false },
  { id: "RES-2025", activityId: "equipo", group: "Temporada", date: "2026-09-18", time: "21:00–22:15", student: "Iago Ferreiro", phone: "666 88 99 00", status: "pendiente", trial: true },
  { id: "RES-2019", activityId: "grupo-reducido", group: "Avanzado", date: "2026-08-25", time: "20:00–20:50", student: "Sara Blanco", phone: "644 66 77 88", status: "cancelada", trial: false },
  { id: "RES-2011", activityId: "rehabilitacion", group: "Fase avanzada", date: "2026-08-11", time: "11:00–11:50", student: "Noa Pardo", phone: "633 55 66 77", status: "completada", trial: false },
  { id: "RES-2003", activityId: "individual", group: "Intermedio", date: "2026-08-05", time: "09:00–10:00", student: "Marta Souto", phone: "600 12 34 56", status: "completada", trial: false },
  { id: "RES-1998", activityId: "grupo-reducido", group: "Intermedio", date: "2026-07-28", time: "19:00–19:50", student: "Diego Castro", phone: "611 22 33 44", status: "cancelada", trial: false }
];

/* Avisos y comunicaciones del centro (demo). "leidoAlumno" simula el estado de
   lectura de la única cuenta de cliente de demostración. */
var NOTICES = [
  { id: "AV-01", title: "Plazas libres en grupo reducido", message: "Se han liberado plazas en el grupo reducido de las 19:00 (lunes y miércoles). Ejemplo de aviso.", category: "horarios", audience: "Todos", priority: "normal", publishDate: "2026-09-10", status: "publicado", urgent: false, leidoAlumno: true },
  { id: "AV-02", title: "Nuevo horario de readaptación de lesiones", message: "Se amplía el horario de readaptación de lesiones a los lunes y miércoles a las 11:00 (ejemplo).", category: "actividades", audience: "Todos", priority: "normal", publishDate: "2026-09-12", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-03", title: "Revisión de objetivos trimestral", message: "En las próximas semanas revisaremos contigo tu objetivo y ajustaremos el plan si hace falta (ejemplo, fecha por confirmar).", category: "general", audience: "Todos", priority: "urgente", publishDate: "2026-09-14", status: "publicado", urgent: true, leidoAlumno: false },
  { id: "AV-04", title: "El centro permanecerá cerrado el próximo festivo", message: "No habrá sesiones el próximo lunes festivo. Actividad normal el resto de la semana (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-15", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-05", title: "Recordatorio de equipación", message: "Recomendamos traer calzado deportivo de suela plana y toalla propia (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-08", status: "archivado", urgent: false, leidoAlumno: true },
  { id: "AV-06", title: "Ajuste de tarifas del trimestre", message: "Borrador interno: pendiente de validar importes antes de comunicar a los clientes (ejemplo).", category: "pagos", audience: "Todos", priority: "normal", publishDate: "", status: "borrador", urgent: false, leidoAlumno: false }
];
