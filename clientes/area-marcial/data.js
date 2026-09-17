/* Área Marcial — configuración central de datos mock.
   Todo lo de aquí es demostración. Cuando la academia valide datos reales
   (horarios, plazas, alumnos, profesores), se sustituye solo en este archivo. */

var CLUB = {
  name: "Área Marcial",
  legalName: "Área Marcial — Academia de artes marciales",
  address: "C. Cial. Área Central, Local 28A, 15707 Santiago de Compostela, A Coruña",
  locationNote: "Planta alta, local 28A, esquina amarilla",
  phone: "637 235 156",
  phoneHref: "+34637235156",
  whatsappHref: "https://wa.me/34637235156",
  instagram: "https://www.instagram.com/area_marcial_santiago/",
  scheduleNote: "Lunes a viernes, de 18:00 a 21:00 (horario orientativo, consulta disponibilidad)",
  minAge: 4,
  program: "GTMA — Global Traditional Martial Arts",
  philosophy: "Confianza, respeto, disciplina y superación, dentro y fuera del tatami",
  notice: "Aviso de la academia: quedan plazas para clases de prueba esta semana (ejemplo de aviso)."
};

var PHILOSOPHY_VALUES = [
  { title: "Confianza", text: "Cada avance en el tatami se traduce en seguridad fuera de él." },
  { title: "Respeto", text: "Hacia el compañero, el profesor y uno mismo, siempre." },
  { title: "Disciplina", text: "El progreso llega con constancia, no con atajos." },
  { title: "Autoestima", text: "Cada cinturón y cada clase suman a cómo te ves." },
  { title: "Autocontrol", text: "Aprender a regular el cuerpo y la mente bajo presión." },
  { title: "Superación personal", text: "El único rival real es quien eras la semana pasada." }
];

var BENEFITS = [
  { title: "Mejora de la condición física", icon: "bolt" },
  { title: "Coordinación y movilidad", icon: "grid" },
  { title: "Disciplina y autocontrol", icon: "check" },
  { title: "Confianza y autoestima", icon: "user" },
  { title: "Defensa personal", icon: "settings" },
  { title: "Comunidad y superación", icon: "bell" }
];

var AUDIENCES = [
  { id: "ninos", title: "Niños desde 4 años", text: "Trabajo de coordinación, atención y valores a través del juego dirigido y la técnica base, adaptado a cada edad." },
  { id: "jovenes", title: "Jóvenes", text: "Progresión técnica, trabajo en grupo y primeras experiencias de superación personal y, para quien lo desee, iniciación a la competición." },
  { id: "adultos", title: "Adultos", text: "Entrenamiento físico y técnico, gestión del estrés y una comunidad con la que entrenar de forma constante." }
];

/* Disciplinas y programas públicos. "confirmed" marca lo comunicado públicamente
   con seguridad; los programas sin información pública suficiente van marcados
   como "bajo consulta" y no deben presentarse como confirmados. */
var DISCIPLINES = [
  { id: "judo", name: "Judo", confirmed: true, what: "Arte marcial olímpico centrado en proyecciones, control y caída segura.", forWhom: "Niños desde 4 años, jóvenes y adultos.", benefits: "Coordinación, disciplina, defensa personal y trabajo en equipo.", level: "Iniciación e intermedio", tipo: "disciplina" },
  { id: "aikido", name: "Aikido", confirmed: true, what: "Arte marcial basado en redirigir la energía del ataque en vez de oponer fuerza.", forWhom: "Jóvenes y adultos.", benefits: "Control corporal, fluidez de movimiento y gestión del conflicto sin violencia.", level: "Iniciación", tipo: "disciplina" },
  { id: "aikido-iwama", name: "Aikido Iwama", confirmed: true, what: "Estilo de Aikido con fuerte componente de armas tradicionales (bokken, jo).", forWhom: "Practicantes de Aikido con base o interés en el trabajo con armas.", benefits: "Precisión técnica, disciplina y profundización en los fundamentos del Aikido.", level: "Intermedio", tipo: "disciplina" },
  { id: "aikido-aikikai", name: "Aikido Aiki-kai", confirmed: true, what: "Estilo de Aikido dentro de la corriente Aikikai, orientado a la técnica a mano vacía.", forWhom: "Jóvenes y adultos interesados en Aikido.", benefits: "Coordinación, control y una vía de desarrollo personal a largo plazo.", level: "Iniciación e intermedio", tipo: "disciplina" },
  { id: "iniciacion", name: "Programas de iniciación", confirmed: false, what: "Primer contacto con las artes marciales, pensado para quien empieza desde cero.", forWhom: "Niños, jóvenes y adultos sin experiencia previa.", benefits: "Base técnica, adaptación al grupo y primeros valores del tatami.", level: "Iniciación", tipo: "programa" },
  { id: "adultos-prog", name: "Programas para adultos", confirmed: false, what: "Entrenamiento adaptado a horarios y objetivos de personas adultas.", forWhom: "Adultos que empiezan o retoman la práctica.", benefits: "Forma física, defensa personal y desconexión.", level: "Todos los niveles", tipo: "programa" },
  { id: "competicion-prog", name: "Programas de formación y competición", confirmed: false, what: "Vía orientada a quien quiere profundizar técnicamente o participar en competición.", forWhom: "Practicantes con base técnica y orientación competitiva.", benefits: "Preparación técnica y física específica.", level: "Avanzado", tipo: "programa" }
];

/* Alias usado por el wizard de reserva y el panel admin, con la misma forma que
   ACTIVITIES en la plantilla original (id/name/what/forWhom/level/duration/...). */
var ACTIVITIES = DISCIPLINES.map(function (d) {
  return {
    id: d.id, name: d.name, what: d.what, forWhom: d.forWhom, level: d.level,
    duration: "50 min (ejemplo)", ageRange: d.id === "iniciacion" ? "Desde " + CLUB.minAge + " años" : "Consultar edad recomendada",
    availability: d.confirmed ? "Plazas limitadas" : "Programa disponible bajo consulta",
    tipo: d.tipo
  };
});

var GROUPS = {
  "judo": ["Iniciación infantil", "Juvenil", "Adultos"],
  "aikido": ["Iniciación", "Avanzado"],
  "aikido-iwama": ["Grupo único"],
  "aikido-aikikai": ["Grupo único"],
  "iniciacion": ["Grupo único"],
  "adultos-prog": ["Grupo único"],
  "competicion-prog": ["Grupo único"]
};

/* Horario de ejemplo, claramente editable desde Configuración/Calendario del panel
   admin. Sustituir por el horario real de la academia antes de publicar. */
var SCHEDULE = [
  { activityId: "judo", days: ["Lunes", "Miércoles"], time: "18:00–19:00" },
  { activityId: "judo", days: ["Martes", "Jueves"], time: "19:00–20:00" },
  { activityId: "aikido", days: ["Lunes", "Miércoles"], time: "19:00–20:00" },
  { activityId: "aikido-iwama", days: ["Viernes"], time: "18:00–19:30" },
  { activityId: "aikido-aikikai", days: ["Martes", "Jueves"], time: "20:00–21:00" },
  { activityId: "iniciacion", days: ["Viernes"], time: "19:30–20:30" }
];

var NAV_ITEMS_ALUMNO = [
  { route: "inicio", label: "Inicio", icon: "home" },
  { route: "reservar", label: "Reservar", icon: "plus" },
  { route: "mis-reservas", label: "Mis reservas", icon: "list" },
  { route: "actividades", label: "Disciplinas", icon: "grid" },
  { route: "avisos", label: "Avisos", icon: "bell", badgeKey: "avisos" },
  { route: "perfil", label: "Perfil", icon: "user" }
];

var NAV_ITEMS_ADMIN = [
  { route: "resumen", label: "Resumen", icon: "grid" },
  { route: "admin-reservas", label: "Reservas", icon: "list" },
  { route: "admin-calendario", label: "Calendario", icon: "calendar" },
  { route: "admin-alumnos", label: "Alumnos", icon: "user" },
  { route: "admin-grupos", label: "Disciplinas y grupos", icon: "grid" },
  { route: "admin-solicitudes", label: "Solicitudes", icon: "bolt" },
  { route: "admin-avisos", label: "Avisos", icon: "bell" },
  { route: "admin-automatizaciones", label: "Automatizaciones", icon: "settings" },
  { route: "admin-config", label: "Configuración", icon: "settings" }
];

/* Login/registro de demostración: no hay backend real. El registro añade una
   cuenta nueva en memoria (se pierde al recargar), no hay contraseñas reales. */
var LOGIN_USERS = {
  admin: { password: "admin", role: "admin", name: "Área Marcial" },
  alumno: { password: "alumno", role: "alumno", name: "Uxío Vidal" }
};

var MY_RESERVATIONS = [
  { id: "RES-1042", activityId: "judo", group: "Juvenil", date: "2026-09-23", time: "19:00–20:00", student: "Uxío Vidal", status: "confirmada" },
  { id: "RES-1039", activityId: "aikido", group: "Iniciación", date: "2026-09-21", time: "19:00–20:00", student: "Uxío Vidal", status: "pendiente" },
  { id: "RES-0988", activityId: "judo", group: "Juvenil", date: "2026-08-14", time: "19:00–20:00", student: "Uxío Vidal", status: "completada" },
  { id: "RES-0965", activityId: "aikido", group: "Iniciación", date: "2026-07-30", time: "19:00–20:00", student: "Uxío Vidal", status: "cancelada" }
];

var PROFILE = {
  name: "Uxío Vidal",
  initials: "UV",
  isFamily: true,
  students: [
    { name: "Uxío Vidal", activity: "Judo", belt: "Cinturón amarillo (dato simulado)" }
  ],
  phone: "622 44 55 66",
  email: "familia.vidal@example.com",
  disciplinasInteres: ["Judo", "Aikido"],
  commsPrefs: ["WhatsApp", "Email"]
};

var AUTOMATIONS = [
  { id: "nueva-reserva", name: "Nueva reserva", steps: ["Reserva", "Ficha del alumno", "Aviso a la academia", "Confirmación", "Recordatorio"], active: true },
  { id: "clase-prueba", name: "Clase de prueba", steps: ["Solicitud recibida", "Contacto del equipo", "Clase de prueba realizada", "Seguimiento posterior"], active: true },
  { id: "no-asistencia", name: "No asistencia", steps: ["No presentado", "Mensaje amable", "Enlace para elegir otra fecha"], active: false },
  { id: "alumno-inactivo", name: "Alumno inactivo", steps: ["Sin actividad", "Segmento antiguos alumnos", "Mensaje de reactivación", "Nueva reserva"], active: true }
];

var ADMIN_ACTIVITY_FEED = [
  { text: "Nueva solicitud de clase de prueba — Noa Pardo (Judo)", time: "hace 2 horas" },
  { text: "Reserva confirmada — Uxío Vidal, Judo", time: "hace 3 horas" },
  { text: "Diego Castro canceló una clase de Aikido", time: "ayer" },
  { text: "Aviso publicado: \"Nuevo horario de Aikido Iwama\"", time: "ayer" },
  { text: "Sara Blanco marcada como pendiente de reactivación", time: "hace 2 días" }
];

var ADMIN_QUICK_ACTIONS = [
  { id: "crear-aviso", label: "Crear aviso", route: "admin-avisos" },
  { id: "anadir-alumno", label: "Añadir alumno", route: "admin-alumnos" },
  { id: "crear-reserva", label: "Crear reserva", route: "admin-reservas" },
  { id: "gestionar-horarios", label: "Gestionar horarios", route: "admin-calendario" },
  { id: "ver-hoy", label: "Ver clases de hoy", route: "admin-calendario" },
  { id: "revisar-solicitudes", label: "Revisar solicitudes", route: "admin-solicitudes" }
];

/* Ficha de alumnos de la academia (demo). "seguimiento" marca casos que el admin debe revisar. */
var STUDENTS = [
  { id: "AL-001", nombre: "Uxío Vidal", edad: 9, tutor: "Familia Vidal", telefono: "622 44 55 66", email: "familia.vidal@example.com", activityId: "judo", group: "Juvenil", nivel: "Cinturón amarillo (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-09", seguimiento: false, notas: ["Buena progresión técnica (nota interna, demo)."] },
  { id: "AL-002", nombre: "Noa Pardo", edad: 7, tutor: "Familia Pardo", telefono: "633 55 66 77", email: "familia.pardo@example.com", activityId: "judo", group: "Iniciación infantil", nivel: "Sin cinturón asignado", estado: "activo", ultimaAsistencia: "", seguimiento: true, notas: ["Solicitud de clase de prueba pendiente de confirmar."] },
  { id: "AL-003", nombre: "Diego Castro", edad: 27, tutor: "", telefono: "611 22 33 44", email: "diego.castro@example.com", activityId: "aikido", group: "Iniciación", nivel: "Sin grado asignado (dato simulado)", estado: "activo", ultimaAsistencia: "2026-08-14", seguimiento: true, notas: ["Canceló su última clase, pendiente de recontactar."] },
  { id: "AL-004", nombre: "Sara Blanco", edad: 31, tutor: "", telefono: "644 66 77 88", email: "sara.blanco@example.com", activityId: "aikido-aikikai", group: "Grupo único", nivel: "Grado intermedio (dato simulado)", estado: "inactivo", ultimaAsistencia: "2026-05-20", seguimiento: true, notas: ["Inactiva desde hace 4 meses. Candidata a mensaje de reactivación."] },
  { id: "AL-005", nombre: "Iago Ferreiro", edad: 16, tutor: "", telefono: "666 88 99 00", email: "iago.ferreiro@example.com", activityId: "aikido-iwama", group: "Grupo único", nivel: "Grado inicial (dato simulado)", estado: "activo", ultimaAsistencia: "2026-09-08", seguimiento: false, notas: ["Muy interesado en el trabajo con armas tradicionales."] }
];

/* Accesos de alumno/familia gestionados por el admin (demo, sin backend real). */
var ACCESSES = [
  { id: "ACC-01", nombre: "Familia Vidal", email: "familia.vidal@example.com", telefono: "622 44 55 66", studentId: "AL-001", tipo: "tutor", estado: "activo" },
  { id: "ACC-02", nombre: "Familia Pardo", email: "familia.pardo@example.com", telefono: "633 55 66 77", studentId: "AL-002", tipo: "tutor", estado: "pendiente" },
  { id: "ACC-03", nombre: "Diego Castro", email: "diego.castro@example.com", telefono: "611 22 33 44", studentId: "AL-003", tipo: "alumno", estado: "activo" },
  { id: "ACC-04", nombre: "Sara Blanco", email: "sara.blanco@example.com", telefono: "644 66 77 88", studentId: "AL-004", tipo: "alumno", estado: "bloqueado" },
  { id: "ACC-05", nombre: "Iago Ferreiro", email: "iago.ferreiro@example.com", telefono: "666 88 99 00", studentId: "AL-005", tipo: "alumno", estado: "activo" }
];

/* Calendario de clases gestionado por el admin (demo). Independiente del horario
   público; aquí se puede crear/editar/eliminar. */
var ADMIN_CLASSES = [
  { id: "CLS-01", activityId: "judo", group: "Iniciación infantil", day: "Lunes", timeStart: "18:00", timeEnd: "19:00", capacity: 14, occupied: 10, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-02", activityId: "judo", group: "Iniciación infantil", day: "Miércoles", timeStart: "18:00", timeEnd: "19:00", capacity: 14, occupied: 10, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-03", activityId: "judo", group: "Juvenil", day: "Martes", timeStart: "19:00", timeEnd: "20:00", capacity: 14, occupied: 9, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-04", activityId: "judo", group: "Juvenil", day: "Jueves", timeStart: "19:00", timeEnd: "20:00", capacity: 14, occupied: 9, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-05", activityId: "aikido", group: "Iniciación", day: "Lunes", timeStart: "19:00", timeEnd: "20:00", capacity: 12, occupied: 7, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-06", activityId: "aikido", group: "Iniciación", day: "Miércoles", timeStart: "19:00", timeEnd: "20:00", capacity: 12, occupied: 7, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-07", activityId: "aikido-iwama", group: "Grupo único", day: "Viernes", timeStart: "18:00", timeEnd: "19:30", capacity: 10, occupied: 6, teacher: "Por asignar (ejemplo)", location: "Sala de armas", notes: "Trabajo con bokken y jo (ejemplo)" },
  { id: "CLS-08", activityId: "aikido-aikikai", group: "Grupo único", day: "Martes", timeStart: "20:00", timeEnd: "21:00", capacity: 12, occupied: 8, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-09", activityId: "aikido-aikikai", group: "Grupo único", day: "Jueves", timeStart: "20:00", timeEnd: "21:00", capacity: 12, occupied: 8, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" },
  { id: "CLS-10", activityId: "iniciacion", group: "Grupo único", day: "Viernes", timeStart: "19:30", timeEnd: "20:30", capacity: 16, occupied: 5, teacher: "Por asignar (ejemplo)", location: "Tatami principal", notes: "" }
];

/* Vista global de reservas para el panel de administración (demo). Distinta de
   MY_RESERVATIONS, que es solo la cuenta de alumno de demostración. */
var ADMIN_RESERVATIONS = [
  { id: "RES-2041", activityId: "judo", group: "Iniciación infantil", date: "2026-09-16", time: "18:00–19:00", student: "Noa Pardo", phone: "633 55 66 77", status: "pendiente", trial: true },
  { id: "RES-2038", activityId: "judo", group: "Juvenil", date: "2026-09-16", time: "19:00–20:00", student: "Uxío Vidal", phone: "622 44 55 66", status: "confirmada", trial: false },
  { id: "RES-2035", activityId: "aikido", group: "Iniciación", date: "2026-09-17", time: "19:00–20:00", student: "Diego Castro", phone: "611 22 33 44", status: "pendiente", trial: true },
  { id: "RES-2030", activityId: "aikido-iwama", group: "Grupo único", date: "2026-09-18", time: "18:00–19:30", student: "Iago Ferreiro", phone: "666 88 99 00", status: "confirmada", trial: false },
  { id: "RES-2028", activityId: "judo", group: "Iniciación infantil", date: "2026-09-10", time: "18:00–19:00", student: "Noa Pardo", phone: "633 55 66 77", status: "no-asistio", trial: false },
  { id: "RES-2025", activityId: "aikido-aikikai", group: "Grupo único", date: "2026-09-18", time: "20:00–21:00", student: "Sara Blanco", phone: "644 66 77 88", status: "pendiente", trial: true },
  { id: "RES-2019", activityId: "aikido-aikikai", group: "Grupo único", date: "2026-08-25", time: "20:00–21:00", student: "Sara Blanco", phone: "644 66 77 88", status: "cancelada", trial: false },
  { id: "RES-2011", activityId: "judo", group: "Juvenil", date: "2026-08-11", time: "19:00–20:00", student: "Uxío Vidal", phone: "622 44 55 66", status: "completada", trial: false },
  { id: "RES-2003", activityId: "aikido", group: "Iniciación", date: "2026-08-05", time: "19:00–20:00", student: "Diego Castro", phone: "611 22 33 44", status: "completada", trial: false },
  { id: "RES-1998", activityId: "iniciacion", group: "Grupo único", date: "2026-07-28", time: "19:30–20:30", student: "Iago Ferreiro", phone: "666 88 99 00", status: "cancelada", trial: false }
];

/* Solicitudes de clase de prueba desde la web pública (demo). Estado independiente
   de las reservas: "nueva" hasta que el admin las trabaja manualmente. */
var TRIAL_REQUESTS = [
  { id: "SOL-01", nombre: "Noa", apellidos: "Pardo", email: "familia.pardo@example.com", telefono: "633 55 66 77", edad: 7, disciplina: "judo", nivel: "Sin experiencia", horario: "Tardes entre semana", observaciones: "Interesada en empezar con judo infantil.", consentimiento: true, estado: "pendiente-confirmacion", fecha: "2026-09-14" },
  { id: "SOL-02", nombre: "Marcos", apellidos: "Lois", email: "marcos.lois@example.com", telefono: "655 22 11 00", edad: 22, disciplina: "aikido", nivel: "Sin experiencia", horario: "Cualquier día entre semana", observaciones: "", consentimiento: true, estado: "nueva", fecha: "2026-09-15" },
  { id: "SOL-03", nombre: "Carla", apellidos: "Mosteiro", email: "carla.mosteiro@example.com", telefono: "699 33 22 11", edad: 14, disciplina: "aikido-iwama", nivel: "Sin experiencia", horario: "Viernes", observaciones: "Le interesa especialmente el trabajo con armas.", consentimiento: true, estado: "contactada", fecha: "2026-09-12" },
  { id: "SOL-04", nombre: "Breogán", apellidos: "Seoane", email: "breogan.seoane@example.com", telefono: "611 44 55 66", edad: 30, disciplina: "aikido-aikikai", nivel: "Con experiencia previa", horario: "Tardes", observaciones: "Practicó aikido hace años en otro club.", consentimiento: true, estado: "realizada", fecha: "2026-08-20" },
  { id: "SOL-05", nombre: "Xoana", apellidos: "Rey", email: "xoana.rey@example.com", telefono: "622 77 88 99", edad: 5, disciplina: "judo", nivel: "Sin experiencia", horario: "Cualquiera", observaciones: "", consentimiento: true, estado: "convertida", fecha: "2026-08-05" }
];

/* Avisos y comunicaciones de la academia (demo). "leidoAlumno" simula el estado de
   lectura de la única cuenta de alumno de demostración. */
var NOTICES = [
  { id: "AV-01", title: "Nuevo horario de Aikido Iwama", message: "El grupo de Aikido Iwama pasa a los viernes de 18:00 a 19:30 (ejemplo).", category: "horarios", audience: "Todos", priority: "normal", publishDate: "2026-09-10", status: "publicado", urgent: false, leidoAlumno: true },
  { id: "AV-02", title: "Jornada de puertas abiertas", message: "Organizamos una jornada de puertas abiertas para familias interesadas en probar una clase gratuita (ejemplo, fecha por confirmar).", category: "actividades", audience: "Todos", priority: "normal", publishDate: "2026-09-12", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-03", title: "Información sobre próxima competición", message: "Los alumnos interesados en competición ya pueden apuntarse al torneo autonómico de octubre (ejemplo, fecha por confirmar).", category: "actividades", audience: "Todos", priority: "urgente", publishDate: "2026-09-14", status: "publicado", urgent: true, leidoAlumno: false },
  { id: "AV-04", title: "La academia permanecerá cerrada el próximo festivo", message: "No habrá clases el próximo lunes festivo. Actividad normal el resto de la semana (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-15", status: "publicado", urgent: false, leidoAlumno: false },
  { id: "AV-05", title: "Recordatorio de equipación", message: "Para las clases es obligatorio el uso de judogi/keikogi según disciplina. Quien lo necesite puede consultarlo en recepción (ejemplo).", category: "general", audience: "Todos", priority: "normal", publishDate: "2026-09-08", status: "archivado", urgent: false, leidoAlumno: true },
  { id: "AV-06", title: "Ajuste de cuotas del trimestre", message: "Borrador interno: pendiente de validar importes antes de comunicar a las familias (ejemplo).", category: "pagos", audience: "Todos", priority: "normal", publishDate: "", status: "borrador", urgent: false, leidoAlumno: false }
];

/* Contenido de la página pública "Mi información" / FAQ. */
var FAQ = [
  { q: "¿Qué llevar a clase?", a: "Ropa cómoda o judogi/keikogi si ya tienes, y algo de beber. Si es tu primera clase de prueba, no necesitas equipación propia (ejemplo, confirmar con la academia)." },
  { q: "¿Cómo funciona una clase de prueba?", a: "Solicitas una clase de prueba desde la web, el equipo de la academia te contacta para confirmar día y hora, y acudes a probar sin compromiso (ejemplo)." },
  { q: "¿Puedo cancelar una reserva?", a: "Sí, desde \"Mis reservas\" puedes solicitar la cancelación según las reglas que confirme la academia (ejemplo)." },
  { q: "¿Desde qué edad se puede empezar?", a: "La academia admite alumnos desde los " + CLUB.minAge + " años (dato público)." }
];
