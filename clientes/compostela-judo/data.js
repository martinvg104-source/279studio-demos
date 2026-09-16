/* Compostela Judo Club — configuración central de datos mock.
   Todo lo de aquí es demostración. Cuando el club valide datos reales
   (horarios, plazas, precios, alumnos), se sustituye solo en este archivo. */

var CLUB = {
  name: "Centro Deportivo Compostela Judo Club",
  shortName: "Compostela Judo Club",
  address: "Centro Comercial Os Tilos, calle Castiñeiro n.º 27-28, Os Tilos, 15894 Teo, A Coruña",
  phone: "615 09 37 34",
  phoneHref: "+34615093734",
  email: "compostelajudoclub@gmail.com",
  since: 2002,
  licenses: "350+",
  teacher: "Javier Rial",
  philosophy: "Formamos personas, transmitimos valores",
  notice: "Aviso del club: la matrícula del curso sigue abierta para todos los grupos (ejemplo de aviso)."
};

var NAV_ITEMS_ALUMNO = [
  { route: "inicio", label: "Inicio", icon: "home" },
  { route: "reservar", label: "Reservar", icon: "plus" },
  { route: "mis-reservas", label: "Mis reservas", icon: "list" },
  { route: "actividades", label: "Actividades", icon: "grid" },
  { route: "avisos", label: "Avisos", icon: "bell", badgeKey: "avisos" },
  { route: "perfil", label: "Perfil", icon: "user" }
];

var NAV_ITEMS_ADMIN = [
  { route: "resumen", label: "Resumen", icon: "grid" },
  { route: "admin-reservas", label: "Reservas", icon: "list" },
  { route: "admin-calendario", label: "Calendario", icon: "calendar" },
  { route: "admin-alumnos", label: "Alumnos", icon: "user" },
  { route: "admin-grupos", label: "Grupos y actividades", icon: "grid" },
  { route: "admin-avisos", label: "Avisos", icon: "bell" },
  { route: "admin-automatizaciones", label: "Automatizaciones", icon: "bolt" },
  { route: "admin-config", label: "Configuración", icon: "settings" }
];

/* Login de demostración: no hay backend ni autenticación real, solo dos
   pares fijos correo/contraseña para enseñar los dos roles de la app. */
var LOGIN_USERS = {
  admin: { password: "admin", role: "admin", name: "Compostela Judo Club" },
  alumno: { password: "alumno", role: "alumno", name: "Marta Souto" }
};

var ACTIVITIES = [
  { id: "judo-infantil", name: "Judo infantil", what: "Técnica base, coordinación y juego dirigido.", forWhom: "Niños y niñas de 4 a 12 años.", level: "Iniciación", duration: "50 min (ejemplo)", ageRange: "4–12 años", availability: "Plazas limitadas", tipo: "judo" },
  { id: "judo-juvenil", name: "Judo juvenil", what: "Progresión técnica y trabajo en grupo.", forWhom: "Jóvenes de 13 a 17 años.", level: "Intermedio", duration: "60 min (ejemplo)", ageRange: "13–17 años", availability: "Plazas disponibles", tipo: "judo" },
  { id: "judo-competicion", name: "Judo competición", what: "Preparación técnica y física para torneos.", forWhom: "Deportistas con orientación competitiva.", level: "Avanzado", duration: "75 min (ejemplo)", ageRange: "Desde 13 años", availability: "Consultar plazas", tipo: "judo" },
  { id: "judo-adultos", name: "Judo adultos", what: "Técnica, forma física y una forma de desconectar.", forWhom: "Adultos que empiezan o retoman el judo.", level: "Todos los niveles", duration: "75 min (ejemplo)", ageRange: "Desde 18 años", availability: "Plazas disponibles", tipo: "judo" },
  { id: "defensa-personal", name: "Defensa personal", what: "Recursos prácticos basados en técnicas de judo.", forWhom: "Quien busca seguridad y control.", level: "Iniciación", duration: "60 min (ejemplo)", ageRange: "Desde 16 años", availability: "Plazas limitadas", tipo: "complementaria" },
  { id: "pilates", name: "Pilates", what: "Movilidad, postura y control corporal.", forWhom: "Complemento de bajo impacto.", level: "Todos los niveles", duration: "50 min (ejemplo)", ageRange: "Adultos", availability: "Plazas disponibles", tipo: "complementaria" },
  { id: "gimnasia-adultos", name: "Gimnasia para adultos", what: "Tonificación y resistencia general.", forWhom: "Mantenerse activo sin impacto articular.", level: "Todos los niveles", duration: "50 min (ejemplo)", ageRange: "Adultos", availability: "Plazas disponibles", tipo: "complementaria" },
  { id: "circuit-training", name: "Circuit training", what: "Estaciones de fuerza y cardio en grupo.", forWhom: "Quien busca intensidad y entrenamiento funcional.", level: "Intermedio", duration: "45 min (ejemplo)", ageRange: "Adultos", availability: "Plazas limitadas", tipo: "complementaria" }
];

var GROUPS = {
  "judo-infantil": ["Iniciación infantil", "Infantil avanzado"],
  "judo-juvenil": ["Juvenil"],
  "judo-competicion": ["Competición"],
  "judo-adultos": ["Adultos iniciación", "Adultos avanzado"],
  "defensa-personal": ["Grupo único"],
  "pilates": ["Grupo único"],
  "gimnasia-adultos": ["Grupo único"],
  "circuit-training": ["Grupo único"]
};

/* Horario orientativo: judo infantil (mié/vie 19:30–20:30) y judo adultos
   (lun/mié/vie 20:30–22:00) usan como referencia visual horarios públicos
   antiguos del club — no son el horario actual, confirmar con el club. */
var SCHEDULE = [
  { activityId: "judo-infantil", days: ["Miércoles", "Viernes"], time: "19:30–20:30" },
  { activityId: "judo-adultos", days: ["Lunes", "Miércoles", "Viernes"], time: "20:30–22:00" },
  { activityId: "judo-juvenil", days: ["Martes", "Jueves"], time: "19:00–20:00" },
  { activityId: "judo-competicion", days: ["Martes", "Jueves"], time: "20:00–21:30" },
  { activityId: "defensa-personal", days: ["Jueves"], time: "20:30–21:30" },
  { activityId: "pilates", days: ["Martes"], time: "18:00–18:50" },
  { activityId: "gimnasia-adultos", days: ["Lunes"], time: "18:00–18:50" },
  { activityId: "circuit-training", days: ["Miércoles"], time: "18:00–18:45" }
];

var MY_RESERVATIONS = [
  { id: "RES-1042", activityId: "judo-infantil", group: "Iniciación infantil", date: "2026-09-23", time: "19:30–20:30", student: "Uxío", status: "confirmada" },
  { id: "RES-1039", activityId: "judo-adultos", group: "Adultos iniciación", date: "2026-09-21", time: "20:30–22:00", student: "Marta Souto", status: "pendiente" },
  { id: "RES-0988", activityId: "defensa-personal", group: "Grupo único", date: "2026-08-14", time: "20:30–21:30", student: "Marta Souto", status: "completada" },
  { id: "RES-0965", activityId: "judo-infantil", group: "Iniciación infantil", date: "2026-07-30", time: "19:30–20:30", student: "Uxío", status: "cancelada" }
];

var PROFILE = {
  name: "Marta Souto",
  initials: "MS",
  isFamily: true,
  students: [
    { name: "Marta Souto", activity: "Judo adultos", belt: "Cinturón azul (dato simulado)" },
    { name: "Uxío Souto", activity: "Judo infantil", belt: "Cinturón amarillo (dato simulado)" }
  ],
  phone: "600 12 34 56",
  email: "marta.souto@example.com",
  commsPrefs: ["WhatsApp", "Email"]
};

var AUTOMATIONS = [
  { id: "nueva-reserva", name: "Nueva reserva", steps: ["Reserva", "Ficha del alumno", "Aviso al club", "Confirmación", "Recordatorio"], active: true },
  { id: "clase-prueba", name: "Clase de prueba", steps: ["Clase reservada", "Recordatorio 24h antes", "Registro de asistencia", "Seguimiento posterior"], active: true },
  { id: "no-asistencia", name: "No asistencia", steps: ["No presentado", "Mensaje amable", "Enlace para elegir otra fecha"], active: false },
  { id: "alumno-inactivo", name: "Alumno inactivo", steps: ["Sin actividad", "Segmento antiguos alumnos", "Mensaje de reactivación", "Nueva reserva"], active: true }
];

var ADMIN_DATA = {
  alumnosActivos: 187,
  solicitudes: [
    { nombre: "Familia Vidal — Uxío (7 años)", meta: "Judo infantil · hace 2 horas" },
    { nombre: "Diego Castro", meta: "Defensa personal · ayer" }
  ],
  reservasHoy: [
    { nombre: "Judo infantil", meta: "19:30–20:30 · 14 alumnos" },
    { nombre: "Judo adultos", meta: "20:30–22:00 · 11 alumnos" }
  ],
  pruebasPendientes: [
    { nombre: "Uxío Vidal", meta: "Judo infantil · miércoles 19:30" },
    { nombre: "Marta Souto", meta: "Judo adultos · lunes 20:30" }
  ],
  ocupacion: [
    { nombre: "Judo infantil · Iniciación", meta: "14 de 16 plazas", occ: 88 },
    { nombre: "Judo adultos · Iniciación", meta: "11 de 18 plazas", occ: 61 },
    { nombre: "Defensa personal", meta: "6 de 12 plazas", occ: 50 }
  ],
  reactivar: [
    { nombre: "Sara Blanco", meta: "Inactiva desde hace 4 meses · antes en judo adultos" },
    { nombre: "Familia Conde — Hugo", meta: "Inactivo desde hace 3 meses · antes en judo infantil" }
  ],
  mensajes: [
    { nombre: "Familia Rey", meta: "Pregunta por horario de competición" },
    { nombre: "Iago Ferreiro", meta: "Quiere cambiar de grupo" }
  ],
  noShow: [
    { nombre: "Noa Pardo", meta: "No asistió · judo infantil · miércoles" }
  ],
  proximasClases: [
    { nombre: "Judo juvenil", meta: "Mañana · 19:00 · 9 alumnos" },
    { nombre: "Pilates", meta: "Mañana · 18:00 · 10 alumnos" }
  ]
};

var ADMIN_ACTIVITY_FEED = [
  { text: "Nueva solicitud de clase de prueba — Familia Vidal (Uxío, 7 años)", time: "hace 2 horas" },
  { text: "Reserva confirmada — Marta Souto, Judo adultos", time: "hace 3 horas" },
  { text: "Diego Castro canceló una clase de Defensa personal", time: "ayer" },
  { text: "Aviso publicado: \"Jornada de puertas abiertas\"", time: "ayer" },
  { text: "Sara Blanco marcada como pendiente de reactivación", time: "hace 2 días" }
];

var ADMIN_QUICK_ACTIONS = [
  { id: "crear-aviso", label: "Crear aviso", route: "admin-avisos" },
  { id: "anadir-alumno", label: "Añadir alumno", route: "admin-alumnos" },
  { id: "crear-reserva", label: "Crear reserva", route: "admin-reservas" },
  { id: "gestionar-horarios", label: "Gestionar horarios", route: "admin-calendario" },
  { id: "ver-hoy", label: "Ver clases de hoy", route: "admin-calendario" },
  { id: "revisar-solicitudes", label: "Revisar solicitudes", route: "admin-reservas" }
];

/* Ficha de alumnos del club (demo). "seguimiento" marca casos que el admin debe revisar. */
var STUDENTS = [
  { id: "AL-001", nombre: "Marta Souto", edad: 34, tutor: "", telefono: "600 12 34 56", email: "marta.souto@example.com", activityId: "judo-adultos", group: "Adultos iniciación", nivel: "Cinturón azul (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-09", seguimiento: false, notas: ["Interesada en clases de competición más adelante (nota interna, demo)."] },
  { id: "AL-002", nombre: "Uxío Souto", edad: 8, tutor: "Marta Souto", telefono: "600 12 34 56", email: "marta.souto@example.com", activityId: "judo-infantil", group: "Iniciación infantil", nivel: "Cinturón amarillo (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-11", seguimiento: false, notas: [] },
  { id: "AL-003", nombre: "Uxío Vidal", edad: 7, tutor: "Familia Vidal", telefono: "622 44 55 66", email: "familiavidal@example.com", activityId: "judo-infantil", group: "Iniciación infantil", nivel: "Sin cinturón asignado", estado: "activo", ultimaAsistencia: "", seguimiento: true, notas: ["Solicitud de clase de prueba pendiente de confirmar."] },
  { id: "AL-004", nombre: "Diego Castro", edad: 29, tutor: "", telefono: "611 22 33 44", email: "diego.castro@example.com", activityId: "defensa-personal", group: "Grupo único", nivel: "Iniciación", estado: "activo", ultimaAsistencia: "2026-08-14", seguimiento: true, notas: ["Canceló su última clase, pendiente de recontactar."] },
  { id: "AL-005", nombre: "Noa Pardo", edad: 10, tutor: "Familia Pardo", telefono: "633 55 66 77", email: "familiapardo@example.com", activityId: "judo-infantil", group: "Infantil avanzado", nivel: "Cinturón naranja (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-10", seguimiento: true, notas: ["No asistió el miércoles, sin justificar."] },
  { id: "AL-006", nombre: "Sara Blanco", edad: 27, tutor: "", telefono: "644 66 77 88", email: "sara.blanco@example.com", activityId: "judo-adultos", group: "Adultos avanzado", nivel: "Cinturón verde (dato simulado)", estado: "inactivo", ultimaAsistencia: "2026-05-20", seguimiento: true, notas: ["Inactiva desde hace 4 meses. Candidata a mensaje de reactivación."] },
  { id: "AL-007", nombre: "Hugo Conde", edad: 9, tutor: "Familia Conde", telefono: "655 77 88 99", email: "familiaconde@example.com", activityId: "judo-infantil", group: "Iniciación infantil", nivel: "Cinturón blanco (dato simulado)", estado: "inactivo", ultimaAsistencia: "2026-06-02", seguimiento: true, notas: ["Inactivo desde hace 3 meses. Antes en judo infantil."] },
  { id: "AL-008", nombre: "Iago Ferreiro", edad: 16, tutor: "", telefono: "666 88 99 00", email: "iago.ferreiro@example.com", activityId: "judo-juvenil", group: "Juvenil", nivel: "Cinturón marrón (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-08", seguimiento: false, notas: ["Quiere valorar el cambio a judo competición."] }
];

/* Accesos de alumno/familia gestionados por el admin (demo, sin backend real). */
var ACCESSES = [
  { id: "ACC-01", nombre: "Marta Souto", email: "marta.souto@example.com", telefono: "600 12 34 56", studentId: "AL-001", tipo: "tutor", estado: "activo" },
  { id: "ACC-02", nombre: "Familia Vidal", email: "familiavidal@example.com", telefono: "622 44 55 66", studentId: "AL-003", tipo: "tutor", estado: "pendiente" },
  { id: "ACC-03", nombre: "Diego Castro", email: "diego.castro@example.com", telefono: "611 22 33 44", studentId: "AL-004", tipo: "alumno", estado: "activo" },
  { id: "ACC-04", nombre: "Sara Blanco", email: "sara.blanco@example.com", telefono: "644 66 77 88", studentId: "AL-006", tipo: "alumno", estado: "bloqueado" },
  { id: "ACC-05", nombre: "Iago Ferreiro", email: "iago.ferreiro@example.com", telefono: "666 88 99 00", studentId: "AL-008", tipo: "alumno", estado: "activo" }
];

/* Calendario de clases gestionado por el admin (demo). Independiente del horario
   que ve el alumno en el wizard de reserva; aquí se puede crear/editar/eliminar. */
var ADMIN_CLASSES = [
  { id: "CLS-01", activityId: "judo-infantil", group: "Iniciación infantil", day: "Miércoles", timeStart: "19:30", timeEnd: "20:30", capacity: 16, occupied: 14, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-02", activityId: "judo-infantil", group: "Iniciación infantil", day: "Viernes", timeStart: "19:30", timeEnd: "20:30", capacity: 16, occupied: 14, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-03", activityId: "judo-adultos", group: "Adultos iniciación", day: "Lunes", timeStart: "20:30", timeEnd: "22:00", capacity: 18, occupied: 11, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-04", activityId: "judo-adultos", group: "Adultos iniciación", day: "Miércoles", timeStart: "20:30", timeEnd: "22:00", capacity: 18, occupied: 11, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-05", activityId: "judo-adultos", group: "Adultos iniciación", day: "Viernes", timeStart: "20:30", timeEnd: "22:00", capacity: 18, occupied: 11, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-06", activityId: "judo-juvenil", group: "Juvenil", day: "Martes", timeStart: "19:00", timeEnd: "20:00", capacity: 14, occupied: 9, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-07", activityId: "judo-juvenil", group: "Juvenil", day: "Jueves", timeStart: "19:00", timeEnd: "20:00", capacity: 14, occupied: 9, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-08", activityId: "judo-competicion", group: "Competición", day: "Martes", timeStart: "20:00", timeEnd: "21:30", capacity: 12, occupied: 8, teacher: "Javier Rial", location: "Tatami principal", notes: "Preparación de torneo (ejemplo)" },
  { id: "CLS-09", activityId: "judo-competicion", group: "Competición", day: "Jueves", timeStart: "20:00", timeEnd: "21:30", capacity: 12, occupied: 8, teacher: "Javier Rial", location: "Tatami principal", notes: "" },
  { id: "CLS-10", activityId: "defensa-personal", group: "Grupo único", day: "Jueves", timeStart: "20:30", timeEnd: "21:30", capacity: 12, occupied: 6, teacher: "Javier Rial", location: "Sala 2", notes: "" },
  { id: "CLS-11", activityId: "pilates", group: "Grupo único", day: "Martes", timeStart: "18:00", timeEnd: "18:50", capacity: 15, occupied: 10, teacher: "Monitor/a de sala (ejemplo)", location: "Sala 2", notes: "" },
  { id: "CLS-12", activityId: "gimnasia-adultos", group: "Grupo único", day: "Lunes", timeStart: "18:00", timeEnd: "18:50", capacity: 15, occupied: 8, teacher: "Monitor/a de sala (ejemplo)", location: "Sala 2", notes: "" },
  { id: "CLS-13", activityId: "circuit-training", group: "Grupo único", day: "Miércoles", timeStart: "18:00", timeEnd: "18:45", capacity: 14, occupied: 9, teacher: "Monitor/a de sala (ejemplo)", location: "Sala 2", notes: "" }
];

/* Vista global de reservas para el panel de administración (demo). Distinta de
   MY_RESERVATIONS, que es solo la cuenta del alumno de demostración. */
var ADMIN_RESERVATIONS = [
  { id: "RES-2041", activityId: "judo-infantil", group: "Iniciación infantil", date: "2026-09-16", time: "19:30–20:30", student: "Uxío Vidal", phone: "622 44 55 66", status: "pendiente", trial: true },
  { id: "RES-2038", activityId: "judo-adultos", group: "Adultos iniciación", date: "2026-09-16", time: "20:30–22:00", student: "Marta Souto", phone: "600 12 34 56", status: "confirmada", trial: false },
  { id: "RES-2035", activityId: "defensa-personal", group: "Grupo único", date: "2026-09-17", time: "20:30–21:30", student: "Diego Castro", phone: "611 22 33 44", status: "pendiente", trial: true },
  { id: "RES-2030", activityId: "judo-juvenil", group: "Juvenil", date: "2026-09-17", time: "19:00–20:00", student: "Iago Ferreiro", phone: "666 88 99 00", status: "confirmada", trial: false },
  { id: "RES-2028", activityId: "judo-infantil", group: "Infantil avanzado", date: "2026-09-10", time: "19:30–20:30", student: "Noa Pardo", phone: "633 55 66 77", status: "no-asistio", trial: false },
  { id: "RES-2025", activityId: "judo-competicion", group: "Competición", date: "2026-09-18", time: "20:00–21:30", student: "Iago Ferreiro", phone: "666 88 99 00", status: "pendiente", trial: true },
  { id: "RES-2019", activityId: "judo-adultos", group: "Adultos avanzado", date: "2026-08-25", time: "20:30–22:00", student: "Sara Blanco", phone: "644 66 77 88", status: "cancelada", trial: false },
  { id: "RES-2011", activityId: "pilates", group: "Grupo único", date: "2026-08-11", time: "18:00–18:50", student: "Marta Souto", phone: "600 12 34 56", status: "completada", trial: false },
  { id: "RES-2003", activityId: "judo-infantil", group: "Iniciación infantil", date: "2026-08-05", time: "19:30–20:30", student: "Uxío Souto", phone: "600 12 34 56", status: "completada", trial: false },
  { id: "RES-1998", activityId: "gimnasia-adultos", group: "Grupo único", date: "2026-07-28", time: "18:00–18:50", student: "Hugo Conde", phone: "655 77 88 99", status: "cancelada", trial: false }
];

/* Avisos y comunicaciones del club (demo). "leidoAlumno" simula el estado de
   lectura de la única cuenta de alumno de demostración. */
var NOTICES = [
  { id: "AV-01", title: "Cambio de horario del grupo infantil", message: "El grupo de iniciación infantil pasa a las 19:30 los miércoles y viernes a partir de la próxima semana (ejemplo).", category: "horarios", audience: "Grupo: Iniciación infantil", priority: "normal", publishDate: "2026-09-10", status: "publicado", urgent: false, leidoAlumno: true },
  { id: "AV-02", title: "Jornada de puertas abiertas", message: "El sábado 26 de septiembre abrimos el club a familias interesadas en probar una clase gratuita (ejemplo).", category: "actividades", audience: "Todos", priority: "normal", publishDate: "2026-09-12", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-03", title: "Información sobre próxima competición", message: "Los alumnos del grupo de competición ya pueden apuntarse al torneo autonómico de octubre (ejemplo, fecha por confirmar).", category: "competición", audience: "Grupo: Competición", priority: "urgente", publishDate: "2026-09-14", status: "publicado", urgent: true, leidoAlumno: false },
  { id: "AV-04", title: "El club permanecerá cerrado el próximo festivo", message: "No habrá clases el próximo lunes festivo. Actividad normal el resto de la semana (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-15", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-05", title: "Recordatorio de equipación", message: "Para las clases de judo es obligatorio el uso de judogi. Quien lo necesite puede consultarlo en recepción (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-08", status: "archivado", urgent: false, leidoAlumno: true },
  { id: "AV-06", title: "Ajuste de cuotas del trimestre", message: "Borrador interno: pendiente de validar importes antes de comunicar a las familias (ejemplo).", category: "pagos", audience: "Todos", priority: "normal", publishDate: "", status: "borrador", urgent: false, leidoAlumno: false }
];
