/* Ortodoncia — demo visual navegable.
   Sin backend, sin almacenamiento: todo vive en memoria y se pierde al recargar.
   Todos los datos son ficticios. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ datos */

  const CLINICS = [
    { id: "ejemplo", name: "Clínica Dental Ejemplo", sub: "Consulta de ortodoncia · lunes, jueves y sábado", patients: 5 },
    { id: "norte", name: "Clínica Dental Ejemplo · Sede Norte", sub: "Consulta de ortodoncia · martes", patients: 0 },
    { id: "centro", name: "Clínica Dental Ejemplo · Sede Centro", sub: "Consulta de ortodoncia · miércoles", patients: 0 },
  ];

  const STATES = {
    estudio: "Estudio",
    presupuesto: "Presupuesto",
    tratamiento: "En tratamiento",
    retencion: "Retención",
    alta: "Alta",
  };

  /* Cada tutor indica qué recibe; `family` resume si los padres están
     separados y cómo se reparte la custodia (dato ya existente, ampliado). */
  const T = (name, role, phone, presupuestos, citas, firma) => ({ name, role, phone, gets: { presupuestos, citas, firma } });

  const PATIENTS = [
    {
      id: "demo", name: "Paciente Demo", initials: "PD", age: 11, born: "14/03/2015", hc: "HC-0001", doctor: "Dr. Ejemplo",
      state: "tratamiento", dentition: "mixta", next: "Jue 8 oct · 17:30", last: "Hace 4 semanas",
      phone: "600 000 001", email: "tutor@ejemplo.test",
      allergies: ["Látex"], conditions: ["Asma leve (inhalador de rescate)"],
      reason: "Apiñamiento anterior y mordida cruzada posterior derecha. Derivado por su dentista general.",
      history: "Sin cirugías previas. Respiración oral nocturna referida por los tutores.",
      meds: [
        { name: "Salbutamol inhalado 100 mcg", how: "1–2 inhalaciones si hay crisis", kind: "Tomar a demanda", by: "Pautado por su pediatra" },
        { name: "Colutorio de flúor 0,05 %", how: "Enjuague de 1 minuto por la noche", kind: "Comprar en farmacia", by: "Recomendado en clínica durante la ortodoncia" },
        { name: "Cera de ortodoncia", how: "Sobre el bracket que roce", kind: "Tener en casa", by: "Recomendado en clínica" },
      ],
      prescription: { file: "receta-salbutamol.pdf", date: "12/03/2026" },
      intake: { via: "enlace", date: "02/03/2026 18:42", by: "Tutora Ejemplo A" },
      tutors: [
        T("Tutora Ejemplo A", "Madre · tutora legal", "600 000 002", true, true, true),
        T("Tutor Ejemplo B", "Padre · tutor legal", "600 000 003", true, true, true),
      ],
      family: { separated: true, custody: "Custodia compartida", note: "Ambos tutores reciben presupuestos y avisos de cita. El consentimiento lo firman los dos." },
    },
    {
      id: "lucia", name: "Lucía Ejemplo", initials: "LE", age: 8, born: "02/06/2018", hc: "HC-0002", doctor: "Dr. Ejemplo",
      state: "estudio", dentition: "temporal", next: "Lun 5 oct · 10:00", last: "Primera visita",
      phone: "600 000 011", email: "familia.lucia@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Primera valoración. Hábito de succión digital.",
      history: "Sin antecedentes relevantes.", meds: [],
      intake: { via: "manual", date: "05/10/2026 09:50", by: "Recepción" },
      tutors: [
        T("Tutor Ejemplo C", "Padre · tutor legal", "600 000 012", true, true, true),
        T("Tutora Ejemplo F", "Madre · tutora legal", "600 000 013", false, true, false),
      ],
      family: { separated: true, custody: "Guarda y custodia del padre", note: "Solo el padre recibe presupuestos y firma. Los dos reciben los avisos de cita." },
    },
    {
      id: "mateo", name: "Mateo Prueba", initials: "MP", age: 14, born: "21/11/2011", hc: "HC-0003", doctor: "Dr. Ejemplo",
      state: "presupuesto", dentition: "permanente", next: "Jue 8 oct · 18:30", last: "Hace 1 semana",
      phone: "600 000 021", email: "familia.mateo@ejemplo.test",
      allergies: ["Penicilina"], conditions: [],
      reason: "Clase II división 1, resalte aumentado.",
      history: "Traumatismo en 11 a los 9 años, sin secuelas.", meds: [],
      intake: { via: "enlace", date: "24/09/2026 21:10", by: "Tutora Ejemplo D" },
      tutors: [T("Tutora Ejemplo D", "Madre · tutora legal", "600 000 022", true, true, true)],
      family: { separated: false, custody: "Un único tutor", note: "Un único tutor con autorización registrada." },
    },
    {
      id: "ana", name: "Ana Ficticia", initials: "AF", age: 17, born: "09/01/2009", hc: "HC-0004", doctor: "Dr. Ejemplo",
      state: "retencion", dentition: "permanente", next: "Sáb 10 oct · 10:30", last: "Hace 3 meses",
      phone: "600 000 031", email: "ana@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Revisión de retención tras aparatología fija.",
      history: "Tratamiento finalizado en 2026.", meds: [],
      intake: { via: "manual", date: "15/01/2024 12:00", by: "Recepción" },
      tutors: [T("Tutora Ejemplo E", "Madre · tutora legal", "600 000 032", true, true, true)],
      family: { separated: false, custody: "Un único tutor", note: "Un único tutor con autorización registrada." },
    },
    {
      id: "carlos", name: "Carlos Muestra", initials: "CM", age: 34, born: "30/07/1992", hc: "HC-0005", doctor: "Dr. Ejemplo",
      state: "alta", dentition: "permanente", next: "—", last: "Hace 8 meses",
      phone: "600 000 041", email: "carlos@ejemplo.test",
      allergies: [], conditions: ["Bruxismo"],
      reason: "Alineadores estéticos por recidiva leve.",
      history: "Ortodoncia en la adolescencia.",
      meds: [{ name: "Férula de descarga nocturna", how: "Todas las noches", kind: "Uso diario", by: "Indicada en clínica" }],
      intake: { via: "enlace", date: "03/11/2025 19:05", by: "El propio paciente" },
      tutors: [], family: null,
    },
    {
      id: "sofia", name: "Sofía Inventada", initials: "SI", age: 13, born: "05/05/2013", hc: "HC-0006", doctor: "Dra. Prueba",
      state: "tratamiento", dentition: "permanente", next: "Mar 6 oct · 17:30", last: "Hace 3 semanas",
      phone: "600 000 051", email: "familia.sofia@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Mordida abierta anterior.", history: "Sin antecedentes relevantes.", meds: [],
      intake: { via: "enlace", date: "10/01/2026 20:30", by: "Tutor Ejemplo G" },
      tutors: [T("Tutor Ejemplo G", "Padre · tutor legal", "600 000 052", true, true, true)],
      family: { separated: false, custody: "Un único tutor", note: "Un único tutor con autorización registrada." },
    },
    {
      id: "hugo", name: "Hugo Ficticio", initials: "HF", age: 10, born: "18/08/2016", hc: "HC-0007", doctor: "Dra. Prueba",
      state: "estudio", dentition: "mixta", next: "Mié 7 oct · 12:00", last: "Primera visita",
      phone: "600 000 061", email: "familia.hugo@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Valoración de maloclusión de clase III.", history: "Sin antecedentes relevantes.", meds: [],
      intake: { via: "manual", date: "30/09/2026 11:20", by: "Recepción" },
      tutors: [
        T("Tutora Ejemplo H", "Madre · tutora legal", "600 000 062", true, true, true),
        T("Tutor Ejemplo I", "Padre · tutor legal", "600 000 063", true, true, true),
      ],
      family: { separated: false, custody: "Conviven ambos tutores", note: "Ambos tutores reciben presupuestos y avisos de cita." },
    },
  ];

  const DOCTOR = "Dr. Ejemplo";
  /* Roles de la demo. El modelo real de permisos sigue abierto (ver skill). */
  const ROLES = {
    profesional: { label: "Profesional / Auxiliar", user: DOCTOR, initials: "DE", hint: "Ves y gestionas solo tus casos y sus presupuestos." },
    admin: { label: "Administración / Coordinación", user: "Coordinación Ejemplo", initials: "CE", hint: "Creas y editas presupuestos. El resto, en solo lectura." },
  };

  /* Trazabilidad: quién hizo qué y cuándo. */
  const EVOLUTION = {
    demo: [
      { date: "12/03/2026 · 10:14", title: "Primera visita", who: "Dr. Ejemplo", role: "Ortodoncista", what: "Exploración clínica y anamnesis revisada con la tutora. Motivo: apiñamiento y mordida cruzada." },
      { date: "12/03/2026 · 10:40", title: "Registros iniciales", who: "Auxiliar Ejemplo", role: "Auxiliar de clínica", what: "Serie de 8 fotos, teleradiografía lateral y escaneado intraoral." },
      { date: "19/03/2026 · 16:05", title: "Estudio cefalométrico", who: "Dr. Ejemplo", role: "Ortodoncista", what: "Trazado manual asistido (Steiner, Ricketts, Jarabak). Plan en dos fases." },
      { date: "02/04/2026 · 12:31", title: "Presupuesto aceptado", who: "Coordinación Ejemplo", role: "Administración", what: "P-2026-0042 firmado por ambos tutores. Entrada + 18 cuotas." },
      { date: "07/05/2026 · 17:00", title: "Colocación de aparatología", who: "Dr. Ejemplo", role: "Ortodoncista", what: "Brackets metálicos superior e inferior. Arco inicial 0.014 NiTi. Asistió Auxiliar Ejemplo." },
      { date: "10/09/2026 · 11:45", title: "Revisión y cambio de arco", who: "Dr. Ejemplo", role: "Ortodoncista", what: "Arco 0.016 NiTi superior. Higiene correcta, sin incidencias." },
      { date: "08/10/2026 · 17:30", title: "Revisión + fotos de control", who: "Dr. Ejemplo", role: "Programada", what: "Pendiente de realizar.", pending: true },
    ],
  };
  const evolutionFor = (p) => EVOLUTION[p.id] || [
    { date: p.intake ? p.intake.date : "—", title: "Alta del paciente", who: p.intake && p.intake.via === "enlace" ? p.intake.by : "Recepción", role: p.intake && p.intake.via === "enlace" ? "Cuestionario por enlace" : "Recepción", what: "Ficha creada con los datos de ingreso." },
    { date: "—", title: "Primera visita", who: p.doctor, role: "Ortodoncista", what: esc(p.reason) },
  ];

  /* Laboratorio: albaranes con 3 pasos (Enviado → Recepcionado → En clínica). */
  const LAB_STEPS = ["Enviado", "Recepcionado", "En clínica"];
  const LAB = {
    demo: [
      { id: "ALB-2026-031", work: "Modelos de estudio", lab: "Laboratorio Ejemplo", who: "Auxiliar Ejemplo", dates: ["13/03/2026", "16/03/2026", "18/03/2026"] },
      { id: "ALB-2026-058", work: "Expansor tipo Hyrax", lab: "Laboratorio Ejemplo", who: "Dr. Ejemplo", dates: ["08/04/2026", "10/04/2026", "21/04/2026"] },
      { id: "ALB-2026-112", work: "Férula de retención superior", lab: "Laboratorio Ejemplo", who: "Dr. Ejemplo", dates: ["01/10/2026", "03/10/2026", null] },
      { id: "ALB-2026-117", work: "Retenedor fijo inferior 3-3", lab: "Laboratorio Muestra", who: "Dr. Ejemplo", dates: ["06/10/2026", null, null] },
    ],
    mateo: [{ id: "ALB-2026-109", work: "Modelos de estudio", lab: "Laboratorio Ejemplo", who: "Auxiliar Ejemplo", dates: ["25/09/2026", "28/09/2026", "30/09/2026"] }],
    ana: [{ id: "ALB-2026-074", work: "Férula de retención superior (repetición)", lab: "Laboratorio Ejemplo", who: "Dr. Ejemplo", dates: ["02/07/2026", "05/07/2026", "09/07/2026"] }],
  };

  /* Recepción: hoy jueves 8 oct, hora simulada 17:42. Fases: llegada, sala, gabinete, salida. */
  const NOW = "17:42";
  const CHECKIN = [
    { who: "Paciente 16", appt: "09:30", what: "Revisión", phase: "fuera", t: { llegada: "09:24", sala: "09:25", gabinete: "09:31", fuera: "09:58" } },
    { who: "Paciente 17", appt: "10:30", what: "Registros · estudio", phase: "fuera", t: { llegada: "10:22", sala: "10:23", gabinete: "10:36", fuera: "11:34" } },
    { who: "Paciente 18", appt: "16:00", what: "Revisión", phase: "fuera", t: { llegada: "15:56", sala: "15:57", gabinete: "16:03", fuera: "16:34" } },
    { who: "Paciente 21", appt: "16:30", what: "Revisión", phase: "fuera", t: { llegada: "16:31", sala: "16:32", gabinete: "16:38", fuera: "17:06" } },
    { who: "Paciente 22", appt: "17:00", what: "Revisión", phase: "gabinete", t: { llegada: "17:09", sala: "17:10", gabinete: "17:12" } },
    { who: "Paciente Demo", id: "demo", appt: "17:30", what: "Revisión + fotos de control", phase: "sala", alert: "Alergia: látex", t: { llegada: "17:21", sala: "17:24" } },
    { who: "Paciente 23", appt: "18:15", what: "Ajuste de retenedor", phase: "llegada", t: { llegada: "17:38" } },
    { who: "Mateo Prueba", id: "mateo", appt: "18:30", what: "Entrega de presupuesto", phase: "pendiente", alert: "Alergia: penicilina", t: {} },
  ];

  /* Balance mensual (solo Administración). Datos ficticios. */
  const BALANCE_MONTHS = [
    ["May", 14, 8], ["Jun", 16, 10], ["Jul", 11, 6], ["Ago", 7, 4], ["Sep", 15, 9], ["Oct", 18, 11],
  ];
  const BALANCE_ROWS = [
    ["P-2026-0042", "Paciente Demo", "Dr. Ejemplo", 3280, "pendiente", "08/10"],
    ["P-2026-0041", "Mateo Prueba", "Dr. Ejemplo", 2950, "pendiente", "07/10"],
    ["P-2026-0040", "Paciente 25", "Dra. Prueba", 1450, "aceptado", "06/10"],
    ["P-2026-0039", "Paciente 26", "Dr. Ejemplo", 620, "aceptado", "05/10"],
    ["P-2026-0038", "Paciente 27", "Dra. Prueba", 480, "rechazado", "03/10"],
    ["P-2026-0037", "Paciente 28", "Dr. Ejemplo", 1180, "aceptado", "02/10"],
    ["P-2026-0036", "Paciente 29", "Dr. Ejemplo", 390, "aceptado", "01/10"],
  ];

  /* Semana de ejemplo: lunes 5 – sábado 10 de octubre de 2026 */
  const DAYS = [
    { short: "Lun", num: 5, sede: "ejemplo" },
    { short: "Mar", num: 6, sede: "norte" },
    { short: "Mié", num: 7, sede: "centro" },
    { short: "Jue", num: 8, sede: "ejemplo", today: true },
    { short: "Vie", num: 9, sede: null },
    { short: "Sáb", num: 10, sede: "ejemplo", endHour: 14 },
  ];

  const APPTS = [
    [0, "09:30", 30, "Mateo Prueba", "Revisión", "revision", "ok"],
    [0, "10:00", 60, "Lucía Ejemplo", "Primera visita · estudio", "estudio", "ok"],
    [0, "11:30", 45, "Paciente Demo", "Cambio de arco", "revision", "ok"],
    [0, "12:30", 30, "Paciente 06", "Revisión", "revision", "pend"],
    [0, "16:00", 90, "Paciente 07", "Colocación brackets", "colocacion", "ok"],
    [0, "18:00", 30, "Paciente 08", "Urgencia · bracket suelto", "urgencia", "ok"],
    [1, "10:00", 30, "Paciente 09", "Revisión", "revision", "ok"],
    [1, "11:00", 60, "Paciente 10", "Registros · estudio", "estudio", "pend"],
    [1, "16:30", 30, "Paciente 11", "Revisión", "revision", "no"],
    [1, "17:30", 45, "Paciente 12", "Retención", "retencion", "ok"],
    [2, "09:30", 90, "Paciente 13", "Colocación brackets", "colocacion", "ok"],
    [2, "12:00", 30, "Paciente 14", "Revisión", "revision", "ok"],
    [2, "17:00", 30, "Paciente 15", "Revisión", "revision", "pend"],
    [3, "09:30", 30, "Paciente 16", "Revisión", "revision", "ok"],
    [3, "10:30", 60, "Paciente 17", "Registros · estudio", "estudio", "ok"],
    [3, "16:00", 30, "Paciente 18", "Revisión", "revision", "ok"],
    [3, "16:30", 30, "Paciente 21", "Revisión", "revision", "ok"],
    [3, "17:00", 30, "Paciente 22", "Revisión", "revision", "ok"],
    [3, "18:15", 15, "Paciente 23", "Ajuste de retenedor", "retencion", "ok"],
    [3, "17:30", 45, "Paciente Demo", "Revisión + fotos de control", "revision", "ok"],
    [3, "18:30", 45, "Mateo Prueba", "Entrega de presupuesto", "estudio", "pend"],
    [5, "09:30", 30, "Paciente 19", "Revisión", "revision", "ok"],
    [5, "10:30", 30, "Ana Ficticia", "Control de retención", "retencion", "ok"],
    [5, "11:30", 60, "Paciente 20", "Retirada de aparatología", "retencion", "no"],
  ];
  const REMINDER = { ok: "Confirmada por WhatsApp", pend: "Recordatorio enviado", no: "Sin respuesta" };

  /* ----------------------------------------------------------- estado vivo */
  const mem = {
    clinic: CLINICS[0], role: "profesional", agendaScope: "sede", teeth: {}, selectedTooth: null, dentition: null, filter: "todos",
    shared: {}, signatures: {}, lab: {}, checkin: null, alta: null,
  };

  /* ----------------------------------------------------------- utilidades */
  const $app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const eur = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
  const patient = (id) => PATIENTS.find((p) => p.id === id) || PATIENTS[0];

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1C2725;color:#fff;padding:10px 16px;border-radius:999px;font-size:13.5px;z-index:50;max-width:calc(100% - 32px);text-align:center;transition:opacity .2s";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 2400);
  }

  /* Motivo propio: arco de puntos que se alinean. `misalign` desplaza puntos
     para sugerir el "antes"; sin él, los puntos siguen la curva limpia. */
  function arch({ w = 120, h = 70, n = 9, r = 4, color = "var(--accent)", misalign = 0, line = true, seed = 3 } = {}) {
    const pts = [];
    const pad = r + 2;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const a = -Math.PI / 2 + t * Math.PI;
      let x = w / 2 + (w / 2 - pad) * Math.sin(a);
      let y = h - pad - (h - 2 * pad) * Math.cos(a);
      if (misalign) {
        const k = Math.sin((i + 1) * seed * 1.7);
        x += k * misalign;
        y += Math.cos((i + 2) * seed) * misalign * 0.9;
      }
      pts.push([x, y]);
    }
    const path = `M${pad} ${h - pad} A${w / 2 - pad} ${h - 2 * pad} 0 0 1 ${w - pad} ${h - pad}`;
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
      ${line ? `<path d="${path}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>` : ""}
      ${pts.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}" ${i === Math.floor(n / 2) ? 'opacity=".55"' : ""}/>`).join("")}
    </svg>`;
  }

  const ICON = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M6 20V4.5h9V20M15 6.5l3 1V20"/><circle cx="12.3" cy="12.5" r=".6" fill="currentColor"/></svg>',
    chart: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" style="flex:none"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" style="flex:none"><path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/></svg>',
    pill: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/></svg>',
    upload: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M12 15V4.5M8 8.5l4-4 4 4M5 15v4.5h14V15"/></svg>',
    qr: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" style="flex:none"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 18.5h1.5M18.5 14H20"/></svg>',
    flask: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3.5h5M10 3.5v6L5 19a1.3 1.3 0 0 0 1.2 1.5h11.6A1.3 1.3 0 0 0 19 19l-5-9.5v-6"/><path d="M7.5 15h9"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg>',
  };

  /* ---------------------------------------------------------------- roles */
  const isAdmin = () => mem.role === "admin";
  const me = () => ROLES[mem.role];
  const RO = "Solo lectura para el rol Administración";
  /* Botón de acción que el rol Administración ve desactivado (solo lectura). */
  function act(label, msg, cls = "") {
    return isAdmin()
      ? `<button class="btn ${cls}" disabled title="${RO}">${label}</button>`
      : `<button class="btn ${cls}" data-demo="${esc(msg)}">${label}</button>`;
  }
  const visiblePatients = () => (isAdmin() ? PATIENTS : PATIENTS.filter((p) => p.doctor === DOCTOR));
  const canSee = (p) => isAdmin() || p.doctor === DOCTOR;

  /* ---------------------------------------------------------------- shell */
  function shell(section, inner, editable = false) {
    const c = mem.clinic, u = me();
    const nav = [
      ["pacientes", "#/pacientes", ICON.users, "Pacientes"],
      ["agenda", "#/agenda", ICON.cal, "Agenda"],
      ["recepcion", "#/recepcion", ICON.door, "Recepción"],
      ...(isAdmin() ? [["balance", "#/balance", ICON.chart, "Balance"]] : []),
    ];
    const roBar = isAdmin() && !editable
      ? `<div class="ro-bar">${ICON.lock}<span><b>Solo lectura.</b> Con el rol Administración puedes crear y editar presupuestos; el resto se consulta sin cambios.</span></div>`
      : "";
    return `<div class="shell">
      <aside class="side">
        <div class="brand">${arch({ w: 38, h: 26, n: 7, r: 2.6 })}
          <div><div class="bname">${esc(c.name.split(" · ")[0])}</div><div class="bsub">${esc(c.name.split(" · ")[1] || "Sede principal")}</div></div>
        </div>
        <nav class="nav" aria-label="Secciones">
          ${nav.map(([k, href, ic, l]) => `<a href="${href}" ${section === k ? 'aria-current="page"' : ""}>${ic}<span>${l}</span></a>`).join("")}
          <a href="#/" title="Cambiar de clínica o de rol">${ICON.swap}<span>Cambiar clínica</span></a>
        </nav>
        <div class="who"><span class="avatar">${u.initials}</span><div><div class="n">${esc(u.user)}</div><div class="role-tag">${u.label}</div><a href="#/">Cambiar rol · salir</a></div></div>
      </aside>
      <main class="main"><div class="view">${roBar}${inner}</div></main>
    </div>`;
  }

  /* ------------------------------------------------ 1. selector de clínica */
  function viewLogin() {
    return `<div class="login"><div class="login-inner view">
      <div class="login-hero">
        ${arch({ w: 56, h: 34, n: 7, r: 3.4 })}
        <h1>Tu consulta de ortodoncia, en cualquier sede y en cualquier dispositivo.</h1>
        <p>Fichas, fotos clínicas, agenda con recordatorios, presupuestos, odontograma y cefalometría en un mismo sitio. Funciona en navegador: tablet Android, iPad u ordenador Windows.</p>
        <div class="arch-hero">${arch({ w: 420, h: 150, n: 14, r: 7, misalign: 0 })}</div>
      </div>
      <div class="clinic-list">
        <h2>¿Con qué rol entras?</h2>
        <div class="role-pick" role="group" aria-label="Rol">
          ${Object.entries(ROLES).map(([k, r]) => `<button class="role-opt" data-role="${k}" aria-pressed="${mem.role === k}">
            <span class="avatar">${r.initials}</span><span><b>${r.label}</b><br><span class="small muted">${esc(r.user)} · ${r.hint}</span></span>
          </button>`).join("")}
        </div>
        <h2 style="margin-top:14px">¿En qué clínica?</h2>
        <p class="muted small" style="margin-bottom:6px">Acceso de ejemplo, sin contraseña</p>
        ${CLINICS.map((c) => `<button class="clinic-card" data-clinic="${c.id}">
          <span class="clinic-mark">${arch({ w: 30, h: 20, n: 6, r: 2.2 })}</span>
          <span class="meta"><span class="name">${esc(c.name)}</span><br><span class="sub">${esc(c.sub)}</span></span>
          <span class="go" aria-hidden="true">›</span>
        </button>`).join("")}
        <p class="login-foot">Los pacientes pertenecen a cada clínica; el profesional puede trabajar en varias sedes. Los roles son un ejemplo: el modelo de permisos real está por definir.</p>
      </div>
    </div></div>`;
  }

  /* ------------------------------------------------ 2. listado de pacientes */
  function viewPatients() {
    const list = visiblePatients();
    const counts = Object.keys(STATES).reduce((a, k) => ((a[k] = list.filter((p) => p.state === k).length), a), {});
    const filters = [["todos", "Todos", list.length], ...Object.entries(STATES).map(([k, v]) => [k, v, counts[k]])];
    const alertCell = (p) => (p.allergies.length ? `<span class="flag">${ICON.warn.replace("<svg", '<svg width="14" height="14"')}Alergia: ${esc(p.allergies.join(", "))}</span>` : `<span class="muted small">—</span>`);
    const hidden = PATIENTS.length - list.length;
    const scopeNote = isAdmin()
      ? `Ves los casos de todos los profesionales de la clínica (${list.length}).`
      : `Mostrando solo tus casos (${list.length}). ${hidden} casos de otros profesionales no son visibles con tu rol.`;
    return shell("pacientes", `
      <div class="page-head">
        <div><div class="eyebrow">${esc(mem.clinic.name)}</div><h1>${isAdmin() ? "Pacientes" : "Mis pacientes"}</h1></div>
        <div class="actions">${isAdmin() ? `<button class="btn primary" disabled title="${RO}">+ Nuevo paciente</button>` : `<a class="btn primary" href="#/alta">+ Nuevo paciente</a>`}</div>
      </div>
      <div class="toolbar">
        <label class="search">${ICON.search}<input type="search" placeholder="Buscar por nombre o nº de historia" aria-label="Buscar paciente"></label>
      </div>
      <div class="filters" role="group" aria-label="Filtrar por estado" style="margin-bottom:10px">
        ${filters.map(([k, label, n]) => `<button class="filter" data-filter="${k}" aria-pressed="${mem.filter === k}">${label} <span class="c">${n}</span></button>`).join("")}
      </div>
      <p class="small muted" style="margin-bottom:14px">${scopeNote}</p>
      <div class="card ptable-wrap"><table class="ptable">
        <thead><tr><th>Paciente</th><th>Estado</th>${isAdmin() ? "<th>Profesional</th>" : ""}<th>Próxima cita</th><th>Alertas</th><th>Última visita</th></tr></thead>
        <tbody>${list.map((p) => `<tr data-go="#/paciente/${p.id}/ficha">
          <td><div class="pname"><span class="avatar">${p.initials}</span><div><div class="n">${esc(p.name)}</div><div class="s">${p.age} años · ${p.hc}</div></div></div></td>
          <td><span class="chip st-${p.state}">${STATES[p.state]}</span></td>
          ${isAdmin() ? `<td>${esc(p.doctor)}</td>` : ""}
          <td class="num">${p.next}</td><td>${alertCell(p)}</td><td class="muted">${p.last}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      <div class="plist-cards">${list.map((p) => `<div class="card pcard" data-go="#/paciente/${p.id}/ficha">
        <div class="pname"><span class="avatar">${p.initials}</span><div><div class="n">${esc(p.name)}</div><div class="s">${p.age} años · ${p.hc}${isAdmin() ? ` · ${esc(p.doctor)}` : ""}</div></div></div>
        <div class="row"><span class="chip st-${p.state}">${STATES[p.state]}</span><span class="small muted">Próxima: ${p.next}</span></div>
        ${p.allergies.length ? `<div>${alertCell(p)}</div>` : ""}
      </div>`).join("")}</div>`);
  }

  /* ------------------------------------------------- cabecera de paciente */
  const PTABS = [["ficha", "Ficha"], ["documentos", "Documentos"], ["fotos", "Fotos clínicas"], ["odontograma", "Odontograma"], ["cefalometria", "Cefalometría"], ["laboratorio", "Laboratorio"], ["presupuesto", "Presupuesto"]];
  function patientFrame(p, tab, inner) {
    const alerts = [
      ...p.allergies.map((a) => `<div class="alert">${ICON.warn}Alergia: ${esc(a)}</div>`),
      ...p.conditions.map((c) => `<div class="alert warn">${ICON.warn}${esc(c)}</div>`),
    ];
    return shell("pacientes", `
      <a class="back" href="#/pacientes">‹ Pacientes</a>
      ${alerts.length ? `<div class="alerts" aria-label="Alertas médicas">${alerts.join("")}</div>` : ""}
      <div class="phead">
        <span class="avatar">${p.initials}</span>
        <div class="info"><h1>${esc(p.name)}</h1>
          <div class="facts"><span>${p.age} años</span><span>${p.hc}</span><span>${esc(p.doctor)}</span><span>Próxima cita: ${p.next}</span></div>
        </div>
        <span class="chip st-${p.state}">${STATES[p.state]}</span>
      </div>
      <nav class="tabs" aria-label="Secciones del paciente">
        ${PTABS.map(([k, l]) => `<a href="#/paciente/${p.id}/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</a>`).join("")}
      </nav>
      ${inner}`, tab === "presupuesto");
  }

  function viewNoAccess(p) {
    return shell("pacientes", `
      <a class="back" href="#/pacientes">‹ Pacientes</a>
      <div class="card card-pad empty-state">
        ${ICON.lock}
        <h2>Este caso es de otro profesional</h2>
        <p class="muted">${esc(p.name)} lo lleva ${esc(p.doctor)}. Con el rol Profesional / Auxiliar solo ves y gestionas tus propios casos.</p>
      </div>`);
  }

  /* --------------------------------------------------- 3. ficha de paciente */
  function familyBlock(p) {
    if (!p.tutors.length) return `<p class="muted">Paciente mayor de edad: sin tutor legal.</p>`;
    const f = p.family;
    const status = f.separated
      ? `<span class="chip st-presupuesto plain">Padres separados</span><span class="chip plain">${esc(f.custody)}</span>`
      : `<span class="chip plain">${esc(f.custody)}</span>`;
    const get = (on, label) => `<span class="getc ${on ? "on" : ""}">${on ? "✓" : "—"} ${label}</span>`;
    return `<div class="fam-status">${status}</div>
      <div class="tutors">${p.tutors.map((t) => `<div class="tutor-c">
        <div class="n">${esc(t.name)}</div><div class="r">${esc(t.role)} · <span class="num">${t.phone}</span></div>
        <div class="getcs">${get(t.gets.presupuestos, "Presupuestos")}${get(t.gets.citas, "Avisos de cita")}${get(t.gets.firma, "Firma")}</div>
      </div>`).join("")}</div>
      <div class="custody">${ICON.info}${esc(f.note)}</div>`;
  }
  function medsBlock(p) {
    const list = p.meds.length
      ? `<ul class="meds">${p.meds.map((m) => `<li>
          <span class="med-ic">${ICON.pill}</span>
          <div class="med-body"><div class="n">${esc(m.name)}</div><div class="small muted">${esc(m.how)} · ${esc(m.by)}</div></div>
          <span class="chip plain">${esc(m.kind)}</span>
        </li>`).join("")}</ul>`
      : `<p class="muted">No toma medicación.</p>`;
    const rx = p.prescription
      ? `<div class="rx-file">${ICON.doc}<div><div class="n">${esc(p.prescription.file)}</div><div class="small muted">Receta escaneada de ejemplo · adjuntada ${p.prescription.date}</div></div></div>`
      : "";
    return `${list}
      <div class="rx">
        ${rx}
        <div class="dropzone" aria-disabled="true">
          ${ICON.upload}
          <div><b>Adjuntar receta escaneada</b><div class="small muted">Imagen o PDF · desactivado en la demo, no se sube nada</div></div>
        </div>
        <p class="small muted">Idea: el paciente vería esta receta también desde su móvil. Solo se muestra y se adjunta; la plataforma no genera recetas.</p>
      </div>`;
  }
  function viewFicha(p) {
    const evo = evolutionFor(p);
    const intake = p.intake
      ? `<a class="intake-link" href="#/paciente/${p.id}/documentos/ingreso">${p.intake.via === "enlace" ? ICON.qr : ICON.doc}<span>${p.intake.via === "enlace" ? `Cuestionario de alta rellenado por <b>${esc(p.intake.by)}</b> desde el enlace · ${p.intake.date}. Anexado a la ficha sin transcribir.` : `Ficha creada manualmente por ${esc(p.intake.by)} · ${p.intake.date}.`}</span><span class="go">Ver ›</span></a>`
      : "";
    return patientFrame(p, "ficha", `
      ${intake}
      <div class="grid-3">
        <div style="display:grid;gap:16px">
          <section class="card card-pad">
            <div class="section-title"><h2>Datos personales</h2>${act("Editar", "Edición desactivada en la demo")}</div>
            <dl class="dl">
              <dt>Fecha de nacimiento</dt><dd class="num">${p.born} (${p.age} años)</dd>
              <dt>Teléfono</dt><dd class="num">${p.phone}</dd>
              <dt>Email</dt><dd>${esc(p.email)}</dd>
              <dt>Clínica</dt><dd>${esc(mem.clinic.name)}</dd>
              <dt>Profesional</dt><dd>${esc(p.doctor)}</dd>
            </dl>
          </section>
          <section class="card card-pad">
            <div class="section-title"><h2>Datos médicos</h2></div>
            <dl class="dl">
              <dt>Motivo de consulta</dt><dd>${esc(p.reason)}</dd>
              <dt>Alergias</dt><dd>${p.allergies.length ? `<b style="color:var(--alert)">${esc(p.allergies.join(", "))}</b>` : "No refiere"}</dd>
              <dt>Patología</dt><dd>${p.conditions.length ? esc(p.conditions.join(", ")) : "No refiere"}</dd>
              <dt>Antecedentes</dt><dd>${esc(p.history)}</dd>
              <dt>Dentición</dt><dd>${p.dentition[0].toUpperCase() + p.dentition.slice(1)}</dd>
            </dl>
            <h3 style="margin:18px 0 10px">Medicación actual</h3>
            ${medsBlock(p)}
          </section>
        </div>
        <div style="display:grid;gap:16px;align-content:start">
          <section class="card card-pad">
            <div class="section-title"><h2>Tutores y custodia</h2></div>
            ${familyBlock(p)}
          </section>
          <div class="demo-note">${ICON.info}<span>Consentimientos y protección de datos: <b>proceso pendiente de definir</b> con las clínicas. Hay una plantilla de ejemplo en Documentos.</span></div>
        </div>
      </div>
      <section class="card card-pad" style="margin-top:16px">
        <div class="section-title"><h2>Evolución</h2><span class="small muted">Quién hizo qué y cuándo</span></div>
        <ol class="trace">${evo.map((e) => `<li class="${e.pending ? "pending" : ""}">
          <span class="tdot"></span>
          <div class="trace-main"><div class="t">${esc(e.title)}</div><div class="w">${e.what}</div></div>
          <div class="trace-who"><span class="avatar sm">${e.who.split(" ").map((s) => s[0]).join("").slice(0, 2)}</span><div><div class="n">${esc(e.who)}</div><div class="small muted">${esc(e.role)}</div></div></div>
          <div class="trace-when num">${e.date}</div>
        </li>`).join("")}</ol>
      </section>`);
  }

  /* ------------------------------------------------------ 4. fotos clínicas */
  /* Ilustraciones con aspecto de toma clínica (fondo de estudio, retractor,
     espejo oclusal). Siguen siendo dibujos: nunca fotos de pacientes. */
  const SKIN = "#E2B99F", SKIN_D = "#C99A7E", HAIR = "#3E302A";
  const PH_DEFS = `<defs>
    <linearGradient id="phStudio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6EBED"/><stop offset="1" stop-color="#C5D0D4"/></linearGradient>
    <radialGradient id="phSkin" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#F2D8C6"/><stop offset="1" stop-color="${SKIN}"/></radialGradient>
    <radialGradient id="phMouth" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#3A2023"/><stop offset="1" stop-color="#120A0B"/></radialGradient>
    <linearGradient id="phTooth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#E9E1D2"/></linearGradient>
  </defs>`;
  const phSvg = (inner) => `<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${PH_DEFS}${inner}</svg>`;
  const shoulders = `<path d="M22 120 Q28 95 62 90 L98 90 Q132 95 138 120 Z" fill="#56666F"/>`;

  function faceFront(smile) {
    return phSvg(`<rect width="160" height="120" fill="url(#phStudio)"/>${shoulders}
      <rect x="71" y="74" width="18" height="20" fill="${SKIN_D}"/>
      <ellipse cx="58.5" cy="57" rx="3.5" ry="6" fill="${SKIN_D}"/><ellipse cx="101.5" cy="57" rx="3.5" ry="6" fill="${SKIN_D}"/>
      <ellipse cx="80" cy="54" rx="22" ry="28" fill="url(#phSkin)"/>
      <path d="M57 52 Q55 24 80 22 Q105 24 103 52 Q101 35 80 33 Q61 35 57 52Z" fill="${HAIR}"/>
      <path d="M68 46 q4.5 -2 9 0 M83 46 q4.5 -2 9 0" stroke="${HAIR}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="72.5" cy="51" rx="2.3" ry="1.3" fill="#2B2422"/><ellipse cx="87.5" cy="51" rx="2.3" ry="1.3" fill="#2B2422"/>
      <path d="M80 53 q-2.5 8 -1 10 q2 1.2 4 0" stroke="${SKIN_D}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      ${smile
        ? `<path d="M70.5 69 Q80 79 89.5 69 Q80 71.5 70.5 69Z" fill="#FFFDF7" stroke="#A8645A" stroke-width="1.3" stroke-linejoin="round"/><path d="M73 70.3 Q80 72.5 87 70.3" stroke="#B9B2A6" stroke-width=".7" fill="none"/>`
        : `<path d="M73 71 q7 2 14 0" stroke="#A8645A" stroke-width="1.7" fill="none" stroke-linecap="round"/>`}`);
  }
  function faceSide() {
    return phSvg(`<rect width="160" height="120" fill="url(#phStudio)"/>${shoulders}
      <path d="M62 30 Q92 22 104 46 L106 60 L114 70 L108 73 L110 81 L106 85 L108 93 Q102 102 88 102 L86 112 L66 116 Q60 104 58 96 Q42 84 44 60 Q46 38 62 30Z" fill="url(#phSkin)"/>
      <path d="M62 30 Q44 34 43 58 Q44 72 50 78 Q52 58 60 50 Q76 40 97 41 Q90 25 62 30Z" fill="${HAIR}"/>
      <ellipse cx="63" cy="63" rx="4" ry="6.5" fill="${SKIN_D}"/>
      <path d="M92 50 q4 -1.5 8 0" stroke="${HAIR}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="97" cy="55" rx="1.6" ry="1.1" fill="#2B2422"/>
      <path d="M104 88 q2 1 4 0" stroke="#A8645A" stroke-width="1.4" fill="none" stroke-linecap="round"/>`);
  }
  /* Vista intraoral con retractor. `bend` desalinea, `brackets` añade aparatología,
     `shift` desplaza la línea media para las laterales. */
  function intraFront({ bend = 0, brackets = false, shift = 0 } = {}) {
    const row = (upper) => {
      let out = "", wire = [];
      for (let i = 0; i < 10; i++) {
        const t = (i - 4.5) / 4.5 + shift * 0.25;
        const a = Math.abs(t);
        const w = 13 - a * 5, h = (upper ? 19 : 15) - a * 5;
        const x = 80 + t * 48 * (1 - 0.12 * a) + shift * -10;
        const dy = bend ? Math.sin((i + (upper ? 1 : 4)) * 2.3) * bend : 0;
        const rot = bend ? Math.cos((i + (upper ? 2 : 5)) * 1.9) * bend * 2.2 : 0;
        const y = upper ? 60 - h + a * a * 6 + dy : 62 - a * a * 5 + dy;
        const cy = y + h / 2;
        out += `<rect x="${(x - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w / 3).toFixed(1)}" fill="url(#phTooth)" stroke="#CFC5B4" stroke-width=".6" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${cy.toFixed(1)})"/>`;
        if (brackets && a < 0.95) { out += `<rect x="${(x - 2).toFixed(1)}" y="${(cy - 2).toFixed(1)}" width="4" height="4" rx=".8" fill="#A9B3B7" stroke="#7E898D" stroke-width=".4"/>`; wire.push(`${x.toFixed(1)},${cy.toFixed(1)}`); }
      }
      if (wire.length) out += `<polyline points="${wire.join(" ")}" fill="none" stroke="#8E999D" stroke-width=".8"/>`;
      return out;
    };
    return phSvg(`<rect width="160" height="120" fill="#1B1112"/>
      <ellipse cx="80" cy="61" rx="74" ry="50" fill="#C77C72"/>
      <ellipse cx="80" cy="61" rx="64" ry="41" fill="url(#phMouth)"/>
      <ellipse cx="${80 - shift * 10}" cy="40" rx="58" ry="16" fill="#DE958E"/>
      <ellipse cx="${80 - shift * 10}" cy="82" rx="55" ry="14" fill="#D98B85"/>
      ${row(true)}${row(false)}`);
  }
  function intraOcclusal(upper) {
    let teeth = "";
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = -1.35 + (2.7 * i) / (n - 1);
      const x = 80 + 44 * Math.sin(a), y = upper ? 96 - 70 * Math.cos(a) : 24 + 70 * Math.cos(a);
      const w = Math.abs(a) > 0.9 ? 13 : Math.abs(a) > 0.5 ? 10 : 9;
      const deg = ((upper ? a : -a) * 180) / Math.PI;
      teeth += `<rect x="${-w / 2}" y="-5.5" width="${w}" height="11" rx="3.2" fill="url(#phTooth)" stroke="#CFC5B4" stroke-width=".6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})"/>`;
    }
    const cy = upper ? 70 : 50;
    return phSvg(`<rect width="160" height="120" fill="#1B1112"/>
      <ellipse cx="80" cy="60" rx="70" ry="54" fill="#8E9CA0" opacity=".35"/>
      <ellipse cx="80" cy="${cy}" rx="46" ry="46" fill="${upper ? "#D98F89" : "#6B3336"}"/>
      ${upper ? `<path d="M80 34 V84 M70 44 q10 4 20 0 M68 54 q12 4 24 0" stroke="#C47A74" stroke-width="1.2" fill="none"/>` : `<ellipse cx="80" cy="54" rx="26" ry="22" fill="#D57F7A"/>`}
      ${teeth}`);
  }
  const SERIES = [
    ["Frente reposo", faceFront(false)], ["Frente sonrisa", faceFront(true)], ["Perfil derecho", faceSide()],
    ["Intraoral frontal", intraFront({ brackets: true })], ["Lateral derecha", intraFront({ brackets: true, shift: -1 })],
    ["Lateral izquierda", intraFront({ brackets: true, shift: 1 })],
    ["Oclusal superior", intraOcclusal(true)], ["Oclusal inferior", intraOcclusal(false)],
  ];
  function viewFotos(p) {
    return patientFrame(p, "fotos", `
      <div class="agenda-bar">
        <div class="seg" role="group" aria-label="Serie">
          <button aria-pressed="true">Control · oct 2026</button><button aria-pressed="false" data-demo="Cambio de serie visual en la demo">Inicial · mar 2026</button>
        </div>
        <button class="btn" disabled title="Subida desactivada en la demo">Subir fotos (desactivado)</button>
      </div>
      <div class="demo-note" style="margin-bottom:14px">${ICON.info}<span>Imágenes de relleno. <b>La demo no sube ni guarda archivos.</b> En la versión real, cada serie usa la misma plantilla de 8 tomas.</span></div>
      <div class="photo-grid">
        ${SERIES.map(([l, svg]) => `<figure class="photo"><div class="ph">${svg}</div><figcaption><span>${l}</span><span class="muted">08/10</span></figcaption></figure>`).join("")}
      </div>
      <div class="series-head"><h2>Antes / después</h2><span class="muted small">Intraoral frontal · desliza para comparar</span></div>
      <div class="ba" id="ba" style="--pos:50%">
        <div class="layer after">${intraFront({ brackets: true })}</div>
        <div class="layer before">${intraFront({ bend: 2.6 })}</div>
        <span class="tag l">Antes · mar 2026</span><span class="tag r">Control · oct 2026</span>
        <div class="handle"></div>
        <input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después">
      </div>
      <div class="ba-dates"><span>Registro inicial</span><span>Ilustración esquemática, no fotografía real</span></div>`);
  }

  /* -------------------------------------------------------- 5. agenda */
  function viewAgenda() {
    const HOUR = 56, START = 9, END = 20;
    const scope = mem.agendaScope;
    const cid = mem.clinic.id;
    const clinicName = (id) => (CLINICS.find((c) => c.id === id) || {}).name || "";
    const times = [];
    for (let h = START; h <= END; h++) times.push(`<span style="top:${(h - START) * HOUR}px">${String(h).padStart(2, "0")}:00</span>`);
    const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    const cols = DAYS.map((d, i) => {
      const visible = scope === "todas" ? !!d.sede : d.sede === cid;
      const endH = d.endHour || END;
      const closedStyle = d.endHour ? `background:linear-gradient(to bottom, transparent ${(endH - START) * HOUR}px, var(--surface-2) ${(endH - START) * HOUR}px), linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% var(--hour);` : "";
      if (!visible) {
        const label = d.sede ? `En ${clinicName(d.sede).replace("Clínica Dental Ejemplo · ", "")}` : "Sin consulta";
        return `<div class="col closed"><div class="closed-label">${label}</div></div>`;
      }
      const items = APPTS.filter((a) => a[0] === i).map(([, start, dur, who, what, kind, rem]) => {
        const top = ((toMin(start) - START * 60) / 60) * HOUR;
        const h = Math.max((dur / 60) * HOUR - 3, 24);
        const sede = scope === "todas" && d.sede !== cid ? ` · ${clinicName(d.sede).replace("Clínica Dental Ejemplo · ", "")}` : "";
        return `<div class="appt ${kind}" style="top:${top + 1}px;height:${h}px" title="${esc(who)} — ${esc(what)}">
          <div class="t">${start} ${esc(who)}</div>
          ${h > 30 ? `<div class="k">${esc(what)}${sede}</div>` : ""}
          ${h > 50 ? `<div class="r ${rem}">${REMINDER[rem]}</div>` : ""}
        </div>`;
      }).join("");
      return `<div class="col" style="${closedStyle}">${items}</div>`;
    }).join("");
    const heads = DAYS.map((d) => `<div class="dh ${d.today ? "today" : ""}">${d.short}<b>${d.num}</b></div>`).join("");
    const pending = APPTS.filter((a) => a[6] !== "ok").length;
    return shell("agenda", `
      <div class="page-head">
        <div><div class="eyebrow">${esc(mem.clinic.name)}</div><h1>Agenda · 5–10 octubre 2026</h1></div>
        <div class="actions"><button class="btn" data-demo="Navegación de semanas desactivada en la demo">‹</button><button class="btn" data-demo="Navegación de semanas desactivada en la demo">Hoy</button><button class="btn" data-demo="Navegación de semanas desactivada en la demo">›</button>${act("+ Nueva cita", "Crear cita desactivado en la demo", "primary")}</div>
      </div>
      <div class="agenda-bar">
        <div class="seg" role="group" aria-label="Alcance de la agenda">
          <button data-scope="sede" aria-pressed="${scope === "sede"}">Esta sede</button>
          <button data-scope="todas" aria-pressed="${scope === "todas"}">Todas mis sedes</button>
        </div>
        <span class="small muted">${pending} citas sin confirmar esta semana · recordatorio automático 48 h antes</span>
      </div>
      ${scope === "todas" ? `<div class="demo-note" style="margin-bottom:12px">${ICON.info}<span><b>Por decidir:</b> si el doctor ve una agenda consolidada de todas las sedes o una agenda por clínica. Esta vista muestra cómo se vería la opción consolidada.</span></div>` : ""}
      <div class="card cal-wrap"><div class="cal" style="--hour:${HOUR}px">
        <div class="dh"></div>${heads}
        <div class="times" style="height:${(END - START) * HOUR}px">${times.join("")}</div>${cols}
      </div></div>
      <div class="legend">
        <span><i style="background:var(--accent)"></i>Revisión</span>
        <span><i style="background:var(--lilac)"></i>Estudio / registros</span>
        <span><i style="background:var(--warn)"></i>Colocación</span>
        <span><i style="background:var(--ok)"></i>Retención</span>
        <span><i style="background:var(--alert)"></i>Urgencia</span>
      </div>`);
  }

  /* -------------------------------------------------------- 6. presupuesto */
  /* Plantilla de documento con logo de clínica: la usan presupuesto e informe final. */
  function docHead(title, ref, chip) {
    return `<div class="quote-head">
      <div>${arch({ w: 40, h: 26, n: 7, r: 2.6 })}<h2 style="margin-top:8px">${esc(mem.clinic.name)}</h2><p class="small muted">${title}</p></div>
      <div class="ref">${ref}${chip || ""}</div>
    </div>`;
  }
  const recipients = (p, what) => p.tutors.length ? p.tutors.filter((t) => t.gets[what]).map((t) => t.name) : [p.name];

  function viewPresupuesto(p) {
    const lines = [
      ["Estudio de ortodoncia", "Registros, fotografías, modelos y estudio cefalométrico", 1, 150],
      ["Aparatología fija superior e inferior", "Brackets metálicos convencionales", 1, 1800],
      ["Revisiones mensuales", "Controles y activaciones durante el tratamiento", 18, 60],
      ["Retención", "Retenedor fijo inferior + férula superior", 1, 250],
    ];
    const total = lines.reduce((s, l) => s + l[2] * l[3], 0);
    const down = 480;
    const to = recipients(p, "presupuestos");
    const shared = mem.shared[p.id];
    const roleBar = isAdmin()
      ? `<div class="role-bar">
          <span>${ICON.chart}<b>Administración</b> · puedes crear y editar presupuestos de todos los casos.</span>
          <span class="actions"><a class="btn" href="#/balance">Balance mensual ›</a><button class="btn" data-demo="Edición de presupuesto simulada en la demo">Editar</button><button class="btn primary" data-demo="Nuevo presupuesto simulado en la demo">+ Nuevo presupuesto</button></span>
        </div>`
      : `<div class="role-bar">
          <span>${ICON.users}<b>Tu caso</b> · gestionas este presupuesto. Recepción no lo ve hasta que lo compartes.</span>
          <span class="actions">${shared
            ? `<span class="chip st-retencion">Compartido con recepción · ${shared}</span><button class="btn" data-share="${p.id}">Dejar de compartir</button>`
            : `<button class="btn primary" data-share="${p.id}">Compartir con recepción</button>`}</span>
        </div>`;
    return patientFrame(p, "presupuesto", `
      ${roleBar}
      <div class="card card-pad quote">
        ${docHead("Presupuesto de tratamiento de ortodoncia", `<div class="eyebrow">Nº presupuesto</div><div class="num" style="font-weight:600">P-2026-0042</div>`, `<span class="chip st-presupuesto" style="margin-top:8px">Pendiente de aceptar</span>`)}
        <div class="quote-meta">
          <div><div class="eyebrow">Paciente</div><div class="v">${esc(p.name)}</div></div>
          <div><div class="eyebrow">Doctor</div><div class="v">${esc(p.doctor)}</div></div>
          <div><div class="eyebrow">Fecha</div><div class="v num">08/10/2026</div></div>
          <div><div class="eyebrow">Validez</div><div class="v">30 días</div></div>
        </div>
        <table class="qtable">
          <thead><tr><th>Tratamiento</th><th class="r">Uds.</th><th class="r">Precio</th><th class="r">Importe</th></tr></thead>
          <tbody>${lines.map(([t, d, q, pr]) => `<tr><td>${t}<div class="d">${d}</div></td><td class="r">${q}</td><td class="r">${eur(pr)}</td><td class="r">${eur(q * pr)}</td></tr>`).join("")}</tbody>
        </table>
        <div class="qtotal"><dl>
          <dt class="muted">Subtotal</dt><dd>${eur(total)}</dd>
          <dt class="muted">Descuento</dt><dd>0 €</dd>
          <dt style="align-self:end">Total</dt><dd class="big">${eur(total)}</dd>
        </dl></div>
        <h3 style="margin-top:18px">Forma de pago</h3>
        <div class="plan">
          <div class="opt"><div class="small muted">Pago único</div><div class="v">${eur(total)}</div></div>
          <div class="opt sel"><div class="small muted">Entrada + 18 cuotas</div><div class="v">${eur(down)} + ${eur(Math.round((total - down) / 18))}/mes</div></div>
          <div class="opt"><div class="small muted">Financiación externa</div><div class="v">Según entidad</div></div>
        </div>
        <div class="sign"><div>Firma del paciente o tutor legal</div><div>${esc(p.doctor)} · Nº colegiado 00000</div></div>
        <div class="send-to">${ICON.info}<span>Se enviará a: <b>${to.map(esc).join(" y ")}</b>${p.family && p.family.separated ? ` · ${esc(p.family.custody.toLowerCase())}` : ""}</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
          <button class="btn primary" data-demo="Envío desactivado en la demo">Enviar ${p.tutors.length ? "a los tutores" : "al paciente"}</button>
          <button class="btn" data-demo="Descarga desactivada en la demo">Descargar PDF</button>
        </div>
        <div class="demo-note" style="margin-top:16px">${ICON.info}<span>Importes y tratamientos <b>de ejemplo</b>, no son tarifas de ninguna clínica.</span></div>
      </div>`);
  }

  /* -------------------------------------------------------- 7. odontograma */
  const TOOTH_STATES = {
    sano: { label: "Sano", fill: "#FFFFFF", stroke: "#B9C3C0" },
    caries: { label: "Caries", plural: "caries", fill: "#F3D6CB", stroke: "#A9492F" },
    obturado: { label: "Obturado", plural: "obturados", fill: "#CFE3E0", stroke: "#3E7A74" },
    erupcion: { label: "En erupción", plural: "en erupción", fill: "#F5EBD2", stroke: "#9A6A12", dash: "3 2" },
    ausente: { label: "Ausente", plural: "ausentes", fill: "transparent", stroke: "#B9C3C0", dash: "2 3" },
  };
  const DENT = {
    permanente: {
      up: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
      low: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
      init: { 18: "ausente", 28: "ausente", 38: "ausente", 48: "ausente", 36: "obturado", 16: "caries" },
    },
    mixta: {
      up: [16, 55, 54, 53, 12, 11, 21, 22, 63, 64, 65, 26],
      low: [46, 85, 84, 83, 42, 41, 31, 32, 73, 74, 75, 36],
      init: { 55: "caries", 85: "obturado", 22: "erupcion", 75: "caries", 26: "obturado" },
    },
    temporal: {
      up: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
      low: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
      init: { 54: "caries", 84: "obturado" },
    },
  };
  const toothKind = (n) => {
    const q = Math.floor(n / 10), d = n % 10;
    if (q >= 5) return ["incisor", "incisor", "canine", "molar", "molar"][d - 1];
    return ["incisor", "incisor", "canine", "premolar", "premolar", "molar", "molar", "molar"][d - 1];
  };
  function toothName(n) {
    const q = Math.floor(n / 10), d = n % 10, temp = q >= 5;
    const side = [0, "superior derecho", "superior izquierdo", "inferior izquierdo", "inferior derecho"][temp ? q - 4 : q];
    const name = temp
      ? ["incisivo central", "incisivo lateral", "canino", "primer molar", "segundo molar"][d - 1]
      : ["incisivo central", "incisivo lateral", "canino", "primer premolar", "segundo premolar", "primer molar", "segundo molar", "tercer molar"][d - 1];
    return `${name[0].toUpperCase() + name.slice(1)} ${side}${temp ? " · temporal" : ""}`;
  }
  /* Silueta corona + raíz, dibujada con raíces hacia arriba (maxilar);
     la mandíbula se invierte. Caja 40 × 72, corona abajo. */
  const TOOTH_PATHS = {
    incisor: { crown: "M12 44 Q12 40 14 39 L26 39 Q28 40 28 44 L29 62 Q29 68 20 68 Q11 68 11 62 Z", root: "M14 40 Q15 14 20 6 Q25 14 26 40 Z" },
    canine: { crown: "M12 42 Q12 38 15 38 L25 38 Q28 38 28 42 L28 58 Q26 66 20 69 Q14 66 12 58 Z", root: "M14 39 Q15 10 20 2 Q25 10 26 39 Z" },
    premolar: { crown: "M10 44 Q10 38 15 38 L25 38 Q30 38 30 44 L30 60 Q30 68 20 68 Q10 68 10 60 Z", root: "M13 39 Q14 16 20 8 Q26 16 27 39 Z" },
    molar: { crown: "M6 44 Q6 38 12 38 L28 38 Q34 38 34 44 L34 60 Q34 68 27 68 L24 65 L20 68 L16 65 L13 68 Q6 68 6 60 Z", root: "M8 40 Q8 20 12 10 Q15 24 17 40 Z M23 40 Q25 24 28 10 Q32 20 32 40 Z" },
  };
  function toothSVG(n, stKey, upper, big) {
    const s = TOOTH_STATES[stKey], k = TOOTH_PATHS[toothKind(n)], temp = Math.floor(n / 10) >= 5;
    const flip = upper ? "" : 'transform="translate(0 72) scale(1 -1)"';
    const shift = stKey === "erupcion" ? (upper ? "translate(0 -8)" : "translate(0 8)") : "";
    const ghost = stKey === "ausente";
    const scale = temp ? 'transform="translate(4 7) scale(.8)"' : "";
    const mark = stKey === "caries"
      ? `<circle cx="20" cy="${upper ? 56 : 16}" r="4.2" fill="#A9492F"/>`
      : stKey === "obturado" ? `<rect x="14" y="${upper ? 50 : 12}" width="12" height="9" rx="2.5" fill="#3E7A74"/>` : "";
    return `<svg viewBox="0 0 40 72" class="tsvg ${big ? "big" : ""}" aria-hidden="true">
      <g ${scale}><g transform="${shift}"><g ${flip}>
        <path d="${k.root}" fill="${ghost ? "none" : "#EEF1F0"}" stroke="${ghost ? "#C9D1CE" : "#CBD3D0"}" stroke-width="1.2" ${ghost ? 'stroke-dasharray="2 3"' : ""}/>
        <path d="${k.crown}" fill="${ghost ? "none" : s.fill}" stroke="${s.stroke}" stroke-width="1.6" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""}/>
      </g>${mark}</g></g>
      ${ghost ? '<path d="M13 29 L27 43 M27 29 L13 43" stroke="#B9C3C0" stroke-width="1.6" stroke-linecap="round"/>' : ""}
    </svg>`;
  }
  function viewOdontograma(p) {
    const dentKey = mem.dentition || p.dentition;
    const dent = DENT[dentKey];
    const key = (n) => `${p.id}:${dentKey}:${n}`;
    const state = (n) => mem.teeth[key(n)] || dent.init[n] || "sano";
    const all = [...dent.up, ...dent.low];
    const sel = mem.selectedTooth && all.includes(mem.selectedTooth) ? mem.selectedTooth : null;
    const counts = Object.keys(TOOTH_STATES).map((k) => [k, all.filter((n) => state(n) === k).length]);
    const half = dent.up.length / 2;
    const tooth = (n, upper) => `<button class="tth ${upper ? "up" : "low"} ${sel === n ? "sel" : ""} st-${state(n)}" data-tooth="${n}" aria-label="Pieza ${n}: ${TOOTH_STATES[state(n)].label}" aria-pressed="${sel === n}">
        ${upper ? "" : `<span class="tn">${n}</span>`}${toothSVG(n, state(n), upper)}${upper ? `<span class="tn">${n}</span>` : ""}
      </button>`;
    const row = (list, upper) => `<div class="trow ${upper ? "up" : "low"}">
        <div class="quad">${list.slice(0, half).map((n) => tooth(n, upper)).join("")}</div>
        <div class="quad">${list.slice(half).map((n) => tooth(n, upper)).join("")}</div>
      </div>`;
    return patientFrame(p, "odontograma", `
      <div class="agenda-bar">
        <div class="seg" role="group" aria-label="Dentición">
          ${["temporal", "mixta", "permanente"].map((k) => `<button data-dent="${k}" aria-pressed="${k === dentKey}">${k === "temporal" ? "Temporal (leche)" : k[0].toUpperCase() + k.slice(1)}</button>`).join("")}
        </div>
        <div class="odo-summary">${counts.filter(([k, c]) => c && k !== "sano").map(([k, c]) => `<span class="osum st-${k}"><i></i>${c} ${c === 1 ? TOOTH_STATES[k].label.toLowerCase() : TOOTH_STATES[k].plural}</span>`).join("") || '<span class="small muted">Todas las piezas sanas</span>'}</div>
      </div>
      <div class="odo-layout">
        <div class="card odo-chart">
          <div class="odo-head"><span>Derecha del paciente</span><span class="small muted">Numeración FDI</span><span>Izquierda del paciente</span></div>
          <div class="odo-scroll">
            <div class="odo-grid ${dentKey}">
              <div class="jaw-label">Maxilar superior</div>
              ${row(dent.up, true)}
              <div class="occlusal"><span></span></div>
              ${row(dent.low, false)}
              <div class="jaw-label">Mandíbula</div>
            </div>
          </div>
        </div>
        <div class="card card-pad odo-side">
          ${sel ? `<div class="sel-tooth">${toothSVG(sel, state(sel), dent.up.includes(sel), true)}
              <div><div class="eyebrow">Pieza ${sel}</div><h3>${toothName(sel)}</h3><span class="chip plain st-${state(sel)}-t">${TOOTH_STATES[state(sel)].label}</span></div></div>`
            : `<h3>Selecciona una pieza</h3><p class="small muted" style="margin-top:4px">Toca un diente para ver su detalle y marcar su estado.</p>`}
          <div class="state-grid">
            ${Object.entries(TOOTH_STATES).map(([k, s]) => `<button class="state-btn" data-state="${k}" ${sel && !isAdmin() ? "" : "disabled"} ${isAdmin() ? `title="${RO}"` : ""} aria-pressed="${sel ? state(sel) === k : false}"><span class="sw" style="background:${s.fill};border-color:${s.stroke};${s.dash ? "border-style:dashed" : ""}"></span>${s.label}</button>`).join("")}
          </div>
          <div class="demo-note" style="margin-top:14px">${ICON.info}<span><b>Registro visual de apoyo:</b> lo interpreta y valida el profesional, no es un diagnóstico. <b>Los cambios no se guardan</b> al recargar. Índice de riesgo de caries: pendiente de confirmar con las clínicas.</span></div>
        </div>
      </div>`);
  }

  /* -------------------------------------------------------- 8. cefalometría */
  /* Radiografía de referencia: ÚNICO sitio donde se referencia la imagen.
     Para sustituirla, cambia src y las dimensiones (px reales del archivo).
     PENDIENTE: verificar licencia antes de uso público/comercial fuera de esta
     demo interna. Origen no verificado (búsqueda web). */
  const CEPH_IMAGE = { src: "assets/cefalometria-radiografia.jpg", w: 550, h: 577 };

  /* Orden de colocación y descripción de cada punto. */
  const CEPH_LANDMARKS = [
    ["S", "Silla", "Centro geométrico de la silla turca"],
    ["N", "Nasion", "Punto más anterior de la sutura frontonasal"],
    ["Or", "Orbitario", "Punto más inferior del reborde de la órbita"],
    ["Po", "Porion", "Punto más superior del conducto auditivo externo"],
    ["Ar", "Articular", "Cruce del borde posterior de la rama con la base del cráneo"],
    ["ANS", "Espina nasal anterior", "Punta de la espina nasal anterior"],
    ["PNS", "Espina nasal posterior", "Extremo posterior del paladar duro"],
    ["A", "Punto A", "Punto más profundo de la concavidad anterior del maxilar"],
    ["B", "Punto B", "Punto más profundo de la concavidad anterior de la mandíbula"],
    ["Pog", "Pogonion", "Punto más anterior de la sínfisis"],
    ["Gn", "Gnation", "Punto entre pogonion y mentón sobre el contorno de la sínfisis"],
    ["Me", "Mentón", "Punto más inferior de la sínfisis"],
    ["Go", "Gonion", "Punto más inferior y posterior del ángulo mandibular"],
  ];
  /* Posiciones aproximadas sobre CEPH_IMAGE para el botón "puntos de ejemplo".
     Si se cambia la imagen, hay que rehacerlas. */
  const CEPH_EXAMPLE = {
    S: [240, 180], N: [450, 176], Or: [385, 247], Po: [163, 236], Ar: [202, 262],
    ANS: [456, 300], PNS: [298, 305], A: [432, 325], B: [393, 447], Pog: [409, 490],
    Gn: [402, 504], Me: [390, 510], Go: [250, 432],
  };
  /* Sin regla de calibración: los mm se estiman suponiendo S–N ≈ 70 mm. */
  const CEPH_SN_MM = 70;
  const CEPH_LINES = [
    ["S", "N"], ["N", "A"], ["N", "B"], ["Po", "Or", 1], ["Go", "Me"], ["ANS", "PNS"],
    ["N", "Pog", 1], ["S", "Ar"], ["Ar", "Go"], ["S", "Go", 1], ["N", "Me", 1],
  ];

  const cephState = () => (mem.ceph ||= { pts: {}, current: "S", order: [] });

  /* Geometría básica en coordenadas de imagen (y hacia abajo). */
  const vec = (a, b) => [b[0] - a[0], b[1] - a[1]];
  const len = (v) => Math.hypot(v[0], v[1]);
  const angBetween = (u, v) => (Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (len(u) * len(v))))) * 180) / Math.PI;
  const angAt = (P, vtx, a, b) => angBetween(vec(P[vtx], P[a]), vec(P[vtx], P[b]));
  function signedDistMm(P, pt, l1, l2) {
    const d = vec(P[l1], P[l2]), w = vec(P[l1], P[pt]);
    let dist = (d[0] * w[1] - d[1] * w[0]) / len(d);
    /* Positivo si el punto queda por delante del plano (hacia la cara: Po → Or). */
    const ant = vec(P.Po, P.Or);
    const nrm = [-d[1] / len(d), d[0] / len(d)];
    if (nrm[0] * ant[0] + nrm[1] * ant[1] < 0) dist = -dist;
    return dist * (CEPH_SN_MM / len(vec(P.S, P.N)));
  }

  /* [nombre, puntos necesarios, cálculo, unidad, norma, desviación, esMm] */
  const CEPH_ANALYSES = [
    { title: "Steiner", rows: [
      ["SNA", ["S", "N", "A"], (P) => angAt(P, "N", "S", "A"), "°", 82, 2],
      ["SNB", ["S", "N", "B"], (P) => angAt(P, "N", "S", "B"), "°", 80, 2],
      ["ANB", ["S", "N", "A", "B"], (P) => angAt(P, "N", "S", "A") - angAt(P, "N", "S", "B"), "°", 2, 2],
      ["SN · GoGn", ["S", "N", "Go", "Gn"], (P) => angBetween(vec(P.N, P.S), vec(P.Gn, P.Go)), "°", 32, 5],
    ] },
    { title: "Ricketts", rows: [
      ["Profundidad facial", ["Po", "Or", "N", "Pog"], (P) => angBetween(vec(P.Or, P.Po), vec(P.N, P.Pog)), "°", 87, 3],
      ["Plano mandibular", ["Po", "Or", "Go", "Me"], (P) => angBetween(vec(P.Or, P.Po), vec(P.Me, P.Go)), "°", 26, 4.5],
      ["Convexidad", ["A", "N", "Pog", "Po", "Or", "S"], (P) => signedDistMm(P, "A", "N", "Pog"), " mm", 2, 2, true],
      ["Eje facial", ["Ba", "Pt"], null, "°", 90, 3.5],
    ] },
    { title: "Jarabak", rows: [
      ["Ángulo de la silla", ["N", "S", "Ar"], (P) => angAt(P, "S", "N", "Ar"), "°", 123, 5],
      ["Ángulo articular", ["S", "Ar", "Go"], (P) => angAt(P, "Ar", "S", "Go"), "°", 143, 6],
      ["Ángulo goníaco", ["Ar", "Go", "Me"], (P) => angAt(P, "Go", "Ar", "Me"), "°", 130, 7],
      ["Suma de Björk", ["N", "S", "Ar", "Go", "Me"], (P) => angAt(P, "S", "N", "Ar") + angAt(P, "Ar", "S", "Go") + angAt(P, "Go", "Ar", "Me"), "°", 396, 6],
      ["S-Go / N-Me", ["S", "Go", "N", "Me"], (P) => (len(vec(P.S, P.Go)) / len(vec(P.N, P.Me))) * 100, " %", 63.5, 1.5],
    ] },
  ];

  function cephResultsHTML() {
    const P = cephState().pts;
    const row = ([name, req, fn, u, norm, sd, isMm]) => {
      const head = `<span>${name}${isMm ? ' <span class="approx">aprox.</span>' : ""}</span>`;
      if (!fn) {
        return `<div class="rrow na">${head}<span class="v">—</span><span class="nrm">${norm} ± ${sd}</span>
          <div class="miss">Necesita basion (Ba) y pterigoideo (Pt), que no se marcan en esta demo.</div></div>`;
      }
      const missing = req.filter((k) => !P[k]);
      if (missing.length) {
        return `<div class="rrow na">${head}<span class="v">—</span><span class="nrm">${norm} ± ${sd}</span>
          <div class="miss">Faltan: ${missing.join(", ")}</div></div>`;
      }
      const v = fn(P);
      const lo = norm - sd * 3, hi = norm + sd * 3, pct = (x) => Math.min(100, Math.max(0, ((x - lo) / (hi - lo)) * 100));
      return `<div class="rrow">${head}<span class="v">${isMm ? "≈ " : ""}${v.toFixed(1)}${u}</span><span class="nrm">${norm} ± ${sd}</span>
        <div class="gauge"><span class="band" style="left:${pct(norm - sd)}%;right:${100 - pct(norm + sd)}%"></span><span class="mk" style="left:${pct(v)}%"></span></div></div>`;
    };
    return CEPH_ANALYSES.map((b) => `<section class="card card-pad res-block"><h3>${b.title}<small>valor · norma</small></h3>${b.rows.map(row).join("")}</section>`).join("");
  }

  function cephOverlaySVG() {
    const st = cephState(), P = st.pts;
    const lines = CEPH_LINES.filter(([a, b]) => P[a] && P[b]).map(([a, b, dash]) =>
      `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" class="cl ${dash ? "dash" : ""}"/>`).join("");
    const pts = CEPH_LANDMARKS.filter(([k]) => P[k]).map(([k, name]) => {
      const [x, y] = P[k];
      const left = x > CEPH_IMAGE.w - 60 || k === "Me";
      /* Gn y Me quedan muy juntos al Pog: sus etiquetas van debajo. */
      const ly = k === "Gn" || k === "Me" ? y + 20 : y - 9;
      return `<g class="cp ${st.drag === k ? "drag" : ""}" data-pt="${k}" tabindex="0" role="button" aria-label="${name} (${k}). Arrastra o usa las flechas para ajustar">
        <circle cx="${x}" cy="${y}" r="13" class="hit"/>
        <circle cx="${x}" cy="${y}" r="7" class="ring"/>
        <circle cx="${x}" cy="${y}" r="2.6" class="dot"/>
        <text x="${left ? x - 11 : x + 11}" y="${ly}" text-anchor="${left ? "end" : "start"}" class="pt-label">${k}</text>
      </g>`;
    }).join("");
    return lines + pts;
  }

  function cephPromptHTML() {
    const st = cephState();
    const placed = Object.keys(st.pts).length;
    const cur = CEPH_LANDMARKS.find(([k]) => k === st.current);
    const head = cur
      ? `<div class="eyebrow">${st.pts[cur[0]] ? "Recolocar" : "Siguiente punto"} · ${placed}/${CEPH_LANDMARKS.length}</div>
         <div class="ceph-next"><b>${cur[0]}</b> ${cur[1]}</div><div class="small muted">${cur[2]}. Toca la radiografía para colocarlo.</div>`
      : `<div class="eyebrow">${placed}/${CEPH_LANDMARKS.length} puntos</div><div class="ceph-next">Todos los puntos colocados</div>
         <div class="small muted">Arrastra cualquier punto para ajustarlo, o toca uno de la lista para recolocarlo.</div>`;
    const chips = CEPH_LANDMARKS.map(([k, name]) =>
      `<button class="pchip ${st.pts[k] ? "done" : ""} ${st.current === k ? "cur" : ""}" data-ceph-pick="${k}" title="${name}" aria-pressed="${st.current === k}">${k}</button>`).join("");
    return `${head}<div class="pchips">${chips}</div>`;
  }

  function cephRefresh(parts = ["overlay", "prompt", "results"]) {
    const root = document.getElementById("ceph");
    if (!root) return;
    if (parts.includes("overlay")) root.querySelector("#ceph-overlay").innerHTML = cephOverlaySVG();
    if (parts.includes("prompt")) root.querySelector("#ceph-prompt").innerHTML = cephPromptHTML();
    if (parts.includes("results")) root.querySelector("#ceph-results").innerHTML = cephResultsHTML();
  }

  function cephNextPending(after) {
    const P = cephState().pts;
    const keys = CEPH_LANDMARKS.map(([k]) => k);
    const start = Math.max(0, keys.indexOf(after));
    for (let i = 1; i <= keys.length; i++) {
      const k = keys[(start + i) % keys.length];
      if (!P[k]) return k;
    }
    return null;
  }

  function cephMount() {
    const root = document.getElementById("ceph");
    if (!root) return;
    const svg = root.querySelector("svg.ceph-svg");
    const st = cephState();
    if (isAdmin()) { root.querySelector("#ceph-prompt").insertAdjacentHTML("beforeend", `<p class="small muted" style="margin-top:8px">Solo lectura para el rol Administración: no se pueden colocar puntos.</p>`); root.querySelectorAll("[data-ceph-action], [data-ceph-pick]").forEach((b) => { b.disabled = true; b.title = RO; }); svg.style.cursor = "default"; return; }
    const toImg = (e) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [Math.round(Math.max(0, Math.min(CEPH_IMAGE.w, p.x))), Math.round(Math.max(0, Math.min(CEPH_IMAGE.h, p.y)))];
    };

    svg.addEventListener("pointerdown", (e) => {
      const g = e.target.closest("[data-pt]");
      if (g) {
        e.preventDefault();
        st.drag = g.dataset.pt;
        svg.setPointerCapture(e.pointerId);
        cephRefresh(["overlay"]);
        return;
      }
      st.downAt = [e.clientX, e.clientY];
    });
    svg.addEventListener("pointermove", (e) => {
      if (!st.drag) return;
      st.pts[st.drag] = toImg(e);
      cephRefresh(["overlay", "results"]);
    });
    const endDrag = () => { if (st.drag) { st.drag = null; cephRefresh(); } };
    svg.addEventListener("pointerup", (e) => {
      if (st.drag) { endDrag(); return; }
      if (!st.downAt || !st.current) return;
      const moved = Math.hypot(e.clientX - st.downAt[0], e.clientY - st.downAt[1]);
      st.downAt = null;
      if (moved > 6) return; /* fue un desplazamiento de la página, no un toque */
      const k = st.current;
      st.pts[k] = toImg(e);
      st.order = st.order.filter((x) => x !== k).concat(k);
      st.current = cephNextPending(k);
      cephRefresh();
    });
    svg.addEventListener("pointercancel", () => { st.downAt = null; endDrag(); });

    svg.addEventListener("keydown", (e) => {
      const g = e.target.closest("[data-pt]");
      const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!g || !step) return;
      e.preventDefault();
      const k = g.dataset.pt, m = e.shiftKey ? 5 : 1;
      st.pts[k] = [st.pts[k][0] + step[0] * m, st.pts[k][1] + step[1] * m];
      cephRefresh(["overlay", "results"]);
      root.querySelector(`[data-pt="${k}"]`).focus();
    });

    root.addEventListener("click", (e) => {
      const pick = e.target.closest("[data-ceph-pick]");
      if (pick) { st.current = pick.dataset.cephPick; cephRefresh(["prompt"]); return; }
      const act = e.target.closest("[data-ceph-action]");
      if (!act) return;
      const a = act.dataset.cephAction;
      if (a === "undo") {
        const last = st.order.pop();
        if (last) { delete st.pts[last]; st.current = last; }
      } else if (a === "clear") {
        st.pts = {}; st.order = []; st.current = "S";
      } else if (a === "example") {
        st.pts = JSON.parse(JSON.stringify(CEPH_EXAMPLE));
        st.order = CEPH_LANDMARKS.map(([k]) => k);
        st.current = null;
      }
      cephRefresh();
    });
  }

  function viewCefalometria(p) {
    return patientFrame(p, "cefalometria", `
      <div class="ceph-layout" id="ceph">
        <div>
          <div class="ceph-tools">
            <div id="ceph-prompt" class="ceph-prompt">${cephPromptHTML()}</div>
            <div class="ceph-actions">
              <button class="btn" data-ceph-action="undo">Deshacer</button>
              <button class="btn" data-ceph-action="clear">Borrar todo</button>
              <button class="btn" data-ceph-action="example">Cargar puntos de ejemplo</button>
            </div>
          </div>
          <div class="xray">
            <svg class="ceph-svg" viewBox="0 0 ${CEPH_IMAGE.w} ${CEPH_IMAGE.h}" role="application" aria-label="Radiografía lateral: toca para colocar puntos cefalométricos">
              <image href="${CEPH_IMAGE.src}" x="0" y="0" width="${CEPH_IMAGE.w}" height="${CEPH_IMAGE.h}"/>
              <g id="ceph-overlay">${cephOverlaySVG()}</g>
            </svg>
            <span class="stamp">Radiografía de referencia</span>
            <span class="lock">No se guarda al recargar</span>
            <div class="xray-foot">Puntos marcados por el profesional · apoyo al estudio, no es un diagnóstico</div>
          </div>
        </div>
        <div class="results">
          <div class="demo-note ceph-warn">${ICON.info}<span><b>Apoyo al estudio.</b> El sistema solo calcula a partir de los puntos que marcas. <b>La interpretación y el diagnóstico son siempre del profesional.</b></span></div>
          <div class="demo-note">${ICON.info}<span><b>Ángulos fiables, distancias orientativas.</b> La imagen no tiene regla de calibración: los mm se estiman suponiendo S–N ≈ ${CEPH_SN_MM} mm. Los cocientes (%) no dependen de la escala.</span></div>
          <div id="ceph-results" class="results">${cephResultsHTML()}</div>
          <p class="small muted">Normas orientativas, pendientes de validar con la odontóloga asesora. ${DOCTOR}.</p>
        </div>
      </div>`);
  }

  /* -------------------------------------------------------- 9. documentos */
  const DOCS = [
    ["consentimiento", "Consentimiento informado", "Tratamiento de ortodoncia"],
    ["ingreso", "Formulario de ingreso", "Datos personales, médicos y tutor"],
    ["informe", "Informe final de tratamiento", "Para entregar a la familia"],
  ];
  const signers = (p) => (p.tutors.length ? p.tutors.filter((t) => t.gets.firma).map((t) => t.name) : [p.name]);

  /* Formulario de ingreso: el mismo para el cuestionario por enlace, la ficha
     anexada y el alta manual (`blank` = vacío). */
  function intakeForm(p, { blank = false, locked = false } = {}) {
    const v = (x) => (blank ? "" : esc(x || ""));
    const dis = locked ? "disabled" : "";
    const f = (label, val, wide) => `<label class="fld ${wide ? "wide" : ""}"><span>${label}</span><input ${dis} value="${v(val)}" placeholder="${blank ? label : ""}"></label>`;
    const tutors = blank ? [{ name: "", role: "", phone: "" }] : p.tutors;
    return `<div class="form">
      <h3>Datos personales</h3>
      <div class="fgrid">${f("Nombre y apellidos", p && p.name, true)}${f("Fecha de nacimiento", p && p.born)}${f("Teléfono", p && p.phone)}${f("Email", p && p.email, true)}</div>
      <h3>Datos médicos</h3>
      <div class="fgrid">
        ${f("Motivo de consulta", p && p.reason, true)}
        ${f("Alergias", p && (p.allergies.join(", ") || "No refiere"))}
        ${f("Patologías", p && (p.conditions.join(", ") || "No refiere"))}
        ${f("Medicación actual", p && (p.meds.map((m) => m.name).join(", ") || "Ninguna"), true)}
        ${f("Antecedentes", p && p.history, true)}
      </div>
      ${blank || (p && p.tutors.length) ? `<h3>Tutor legal</h3>
      ${tutors.map((t, i) => `<div class="fgrid">${f(`Tutor ${i + 1} · nombre`, t.name, true)}${f("Relación", t.role)}${f("Teléfono", t.phone)}</div>`).join("")}
      <div class="fgrid">
        <label class="fld"><span>¿Padres separados?</span><select ${dis}><option ${!blank && p.family && p.family.separated ? "selected" : ""}>Sí</option><option ${blank || !(p.family && p.family.separated) ? "selected" : ""}>No</option></select></label>
        ${f("Custodia", p && p.family && p.family.custody)}
      </div>` : ""}
      <label class="chk"><input type="checkbox" ${dis} ${blank ? "" : "checked"}> Acepto el tratamiento de mis datos (texto legal pendiente de definir con las clínicas)</label>
    </div>`;
  }

  function docConsent(p) {
    const who = signers(p);
    const sig = mem.signatures[p.id] || {};
    return `<div class="card card-pad quote doc">
      ${docHead("Consentimiento informado · tratamiento de ortodoncia", `<div class="eyebrow">Documento</div><div class="num" style="font-weight:600">CI-2026-0017</div>`, who.every((n) => sig[n]) ? `<span class="chip st-retencion" style="margin-top:8px">Firmado</span>` : `<span class="chip st-presupuesto" style="margin-top:8px">Pendiente de firma</span>`)}
      <div class="quote-meta">
        <div><div class="eyebrow">Paciente</div><div class="v">${esc(p.name)}</div></div>
        <div><div class="eyebrow">Profesional</div><div class="v">${esc(p.doctor)}</div></div>
        <div><div class="eyebrow">Fecha</div><div class="v num">08/10/2026</div></div>
        <div><div class="eyebrow">Firman</div><div class="v">${who.length} ${who.length === 1 ? "persona" : "personas"}</div></div>
      </div>
      <div class="legal">
        <p>${p.tutors.length ? `Los tutores legales de <b>${esc(p.name)}</b> declaran` : `<b>${esc(p.name)}</b> declara`} haber sido informados por ${esc(p.doctor)} del diagnóstico, del plan de tratamiento de ortodoncia propuesto, de su duración estimada y de sus alternativas.</p>
        <p>Se ha explicado que el tratamiento puede producir molestias pasajeras, descalcificaciones si la higiene no es adecuada, reabsorción radicular y recidiva si no se usan los retenedores indicados, y que el resultado depende también de la colaboración del paciente.</p>
        <p>Pueden revocar este consentimiento en cualquier momento. Han podido hacer preguntas y se les han resuelto las dudas.</p>
        <p class="small muted">Texto de ejemplo: el contenido real del consentimiento está pendiente de revisión clínica y legal.</p>
      </div>
      ${p.family && p.family.separated ? `<div class="send-to">${ICON.info}<span>${esc(p.family.custody)}: ${who.length > 1 ? "deben firmar ambos tutores" : `firma solo ${esc(who[0])}`}.</span></div>` : ""}
      <div class="sigs">${who.map((n) => `<div class="sig">
        <canvas class="sig-pad" data-signer="${esc(n)}" width="560" height="180" aria-label="Firma de ${esc(n)}" ${isAdmin() ? 'data-locked="1"' : ""}></canvas>
        <div class="sig-foot"><span>${esc(n)}</span><button class="link-btn" data-sig-clear="${esc(n)}" ${isAdmin() ? "disabled" : ""}>Borrar firma</button></div>
      </div>`).join("")}</div>
      <p class="small muted" style="margin-top:8px">${isAdmin() ? "Solo lectura para el rol Administración." : "Firma con el dedo o el ratón en el recuadro. Firma simulada: no tiene validez y se borra al recargar."}</p>
    </div>`;
  }

  function docIngreso(p) {
    const via = p.intake && p.intake.via === "enlace";
    return `<div class="card card-pad doc">
      <div class="section-title"><h2>Formulario de ingreso</h2>${act("Guardar cambios", "Guardado simulado: la demo no guarda nada")}</div>
      ${via ? `<div class="linked">${ICON.qr}<div><b>Rellenado por ${esc(p.intake.by)} desde el enlace de alta</b><div class="small muted">Recibido ${p.intake.date} · anexado automáticamente a la ficha, sin transcribir</div></div></div>`
        : `<div class="linked manual">${ICON.doc}<div><b>Ficha creada manualmente</b><div class="small muted">${esc(p.intake ? p.intake.by : "Recepción")} · ${p.intake ? p.intake.date : "—"}</div></div></div>`}
      ${intakeForm(p, { locked: isAdmin() })}
    </div>`;
  }

  function docInforme(p) {
    const phases = [
      ["Estudio y registros", "Mar 2026", 1],
      ["Fase 1 · expansión", "Abr – may 2026", 2],
      ["Fase 2 · aparatología fija", "May 2026 – jul 2027", 14],
      ["Retención", "Desde jul 2027 · mínimo 2 años", 6],
    ];
    const totalM = phases.slice(0, 3).reduce((s, x) => s + x[2], 0);
    const care = [
      "Llevar la férula superior todas las noches durante al menos 2 años.",
      "No morder objetos duros con el retenedor fijo inferior; revisarlo en cada visita.",
      "Cepillado tras cada comida y limpieza del retenedor con cepillo interproximal.",
      "Traer las férulas a cada revisión de retención.",
      "Si el retenedor se despega o la férula no ajusta, pedir cita cuanto antes.",
    ];
    return `<div class="card card-pad quote doc">
      ${docHead("Informe final de tratamiento de ortodoncia", `<div class="eyebrow">Informe</div><div class="num" style="font-weight:600">IF-2026-0009</div>`, `<span class="chip st-presupuesto" style="margin-top:8px">Borrador · se entrega al finalizar</span>`)}
      <div class="quote-meta">
        <div><div class="eyebrow">Paciente</div><div class="v">${esc(p.name)}</div></div>
        <div><div class="eyebrow">Profesional</div><div class="v">${esc(p.doctor)}</div></div>
        <div><div class="eyebrow">Inicio</div><div class="v num">12/03/2026</div></div>
        <div><div class="eyebrow">Fin previsto</div><div class="v num">Jul 2027</div></div>
      </div>
      <h3 class="doc-h">Resultado</h3>
      <div class="rep-photos">
        <figure><div class="ph">${intraFront({ bend: 2.6 })}</div><figcaption>Inicio · intraoral frontal</figcaption></figure>
        <figure><div class="ph">${intraFront({})}</div><figcaption>Final · intraoral frontal</figcaption></figure>
        <figure><div class="ph">${faceFront(true)}</div><figcaption>Final · sonrisa</figcaption></figure>
        <figure><div class="ph xr"><img src="${CEPH_IMAGE.src}" alt="Teleradiografía lateral de referencia"></div><figcaption>Teleradiografía lateral · imagen de referencia</figcaption></figure>
      </div>
      <h3 class="doc-h">Esquema del tratamiento realizado</h3>
      <div class="scheme" aria-hidden="true">${phases.map(([, , m], i) => `<span class="ph-seg s${i}" style="flex:${m}"></span>`).join("")}</div>
      <ol class="phase-list">${phases.map(([t, d, m], i) => `<li><i class="s${i}"></i><b>${t}</b><span>${d}</span><span class="num">${i === 3 ? "—" : `${m} ${m === 1 ? "mes" : "meses"}`}</span></li>`).join("")}</ol>
      <p class="small muted" style="margin-top:6px">Tratamiento activo: ${totalM} meses aprox. Aparatología: expansor tipo Hyrax y brackets metálicos superior e inferior.</p>
      <h3 class="doc-h">Cuidados después del tratamiento</h3>
      <ol class="care">${care.map((c) => `<li>${c}</li>`).join("")}</ol>
      <h3 class="doc-h">Próximas revisiones de retención</h3>
      <div class="next-visits"><span class="chip plain">A los 3 meses</span><span class="chip plain">A los 6 meses</span><span class="chip plain">Cada 6 meses hasta 2 años</span></div>
      <div class="sign"><div>Recibido por el paciente o tutor legal</div><div>${esc(p.doctor)} · Nº colegiado 00000</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:18px">
        ${act("Enviar a la familia", "Envío desactivado en la demo", "primary")}
        <button class="btn" data-demo="Descarga desactivada en la demo">Descargar PDF</button>
      </div>
      <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Fotos ilustrativas y radiografía de referencia (licencia pendiente de verificar). Fechas y fases de ejemplo.</span></div>
    </div>`;
  }

  function viewDocumentos(p, docId) {
    const cur = DOCS.find(([k]) => k === docId) ? docId : "consentimiento";
    const sig = mem.signatures[p.id] || {};
    const stateOf = (k) => k === "consentimiento" ? (signers(p).every((n) => sig[n]) ? ["Firmado", "st-retencion"] : ["Pendiente de firma", "st-presupuesto"])
      : k === "ingreso" ? (p.intake && p.intake.via === "enlace" ? ["Recibido por enlace", "st-tratamiento"] : ["Creado a mano", "st-alta"])
      : ["Borrador", "st-estudio"];
    const body = cur === "ingreso" ? docIngreso(p) : cur === "informe" ? docInforme(p) : docConsent(p);
    return patientFrame(p, "documentos", `
      <div class="docs-layout">
        <nav class="doc-list" aria-label="Documentos del paciente">
          ${DOCS.map(([k, t, s]) => { const [lab, cls] = stateOf(k); return `<a href="#/paciente/${p.id}/documentos/${k}" class="doc-item" ${k === cur ? 'aria-current="page"' : ""}>
            <span class="doc-ic">${ICON.doc}</span><span class="doc-t"><b>${t}</b><span class="small muted">${s}</span></span><span class="chip ${cls}">${lab}</span>
          </a>`; }).join("")}
        </nav>
        <div>${body}</div>
      </div>`);
  }

  /* Firma simulada sobre <canvas>. Vive en memoria mientras no se recarga. */
  function docMount() {
    document.querySelectorAll(".sig-pad").forEach((cv) => {
      const pid = mem._pid, name = cv.dataset.signer;
      const ctx = cv.getContext("2d");
      ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1C2725";
      const saved = (mem.signatures[pid] || {})[name];
      if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0); img.src = saved; }
      if (cv.dataset.locked) return;
      let drawing = false, dirty = false;
      const pos = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height]; };
      cv.addEventListener("pointerdown", (e) => { drawing = true; cv.setPointerCapture(e.pointerId); const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); });
      cv.addEventListener("pointermove", (e) => { if (!drawing) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); dirty = true; });
      const end = () => {
        if (!drawing) return;
        drawing = false;
        if (!dirty) return;
        (mem.signatures[pid] ||= {})[name] = cv.toDataURL();
        rerender();
      };
      cv.addEventListener("pointerup", end);
      cv.addEventListener("pointercancel", end);
    });
  }

  /* -------------------------------------------------------- 10. laboratorio */
  function viewLaboratorio(p) {
    const list = (mem.lab[p.id] ||= JSON.parse(JSON.stringify(LAB[p.id] || [])));
    const stepOf = (a) => a.dates.filter(Boolean).length;
    const card = (a, i) => {
      const done = stepOf(a);
      const label = LAB_STEPS[done - 1];
      const cls = done === 3 ? "st-retencion" : done === 2 ? "st-tratamiento" : "st-presupuesto";
      const next = done < 3 ? LAB_STEPS[done] : null;
      return `<article class="card card-pad alb">
        <div class="alb-head">
          <div><div class="eyebrow num">${a.id}</div><h3>${esc(a.work)}</h3><div class="small muted">${esc(a.lab)} · enviado por ${esc(a.who)}</div></div>
          <span class="chip ${cls}">${label}</span>
        </div>
        <ol class="steps">${LAB_STEPS.map((s, j) => `<li class="${j < done ? "done" : j === done ? "next" : ""}">
          <span class="sdot">${j < done ? "✓" : j + 1}</span><span class="sl">${s}</span><span class="sd num">${a.dates[j] || "Pendiente"}</span>
        </li>`).join("")}</ol>
        ${next ? `<div class="alb-foot">${isAdmin() ? `<button class="btn" disabled title="${RO}">Marcar «${next}»</button>` : `<button class="btn" data-lab="${p.id}:${i}">Marcar «${next}»</button>`}<span class="small muted">Se registra con la fecha de hoy (08/10/2026)</span></div>` : ""}
      </article>`;
    };
    return patientFrame(p, "laboratorio", `
      <div class="agenda-bar">
        <div><h2>Trabajos de laboratorio</h2><p class="small muted">Albaranes ficticios del caso · Enviado → Recepcionado → En clínica</p></div>
        ${act("+ Nuevo albarán", "Nuevo albarán simulado en la demo", "primary")}
      </div>
      ${list.length ? `<div class="alb-list">${list.map(card).join("")}</div>` : `<div class="card card-pad empty-state">${ICON.flask}<h2>Sin trabajos de laboratorio</h2><p class="muted">Este caso todavía no tiene albaranes.</p></div>`}
      <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Laboratorios, albaranes y fechas de ejemplo. Los cambios de estado no se guardan.</span></div>`);
  }

  /* -------------------------------------------------------- 11. recepción */
  const PHASES = [
    ["llegada", "Ha llegado", "Pasar a sala"],
    ["sala", "En sala de espera", "Pasar a gabinete"],
    ["gabinete", "En gabinete", "Marcar salida"],
    ["fuera", "Se ha ido", null],
  ];
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  function viewRecepcion() {
    const list = (mem.checkin ||= JSON.parse(JSON.stringify(CHECKIN)));
    const now = toMin(NOW);
    const since = (c) => now - toMin((c.phase === "gabinete" ? c.t.gabinete : c.t.llegada) || NOW);
    const late = (c) => (c.t.llegada ? toMin(c.t.llegada) - toMin(c.appt) : now - toMin(c.appt));
    const waiting = list.filter((c) => c.phase === "sala" || c.phase === "llegada");
    const longest = waiting.slice().sort((a, b) => toMin(a.t.llegada) - toMin(b.t.llegada))[0];
    const behind = list.filter((c) => c.phase === "sala" && now > toMin(c.appt));
    const pending = list.filter((c) => c.phase === "pendiente");
    const card = (c) => {
      const i = list.indexOf(c);
      const mins = since(c);
      const lateBy = late(c);
      const phase = PHASES.find(([k]) => k === c.phase);
      const badges = [];
      if (c.t.llegada && lateBy > 5) badges.push(`<span class="badge warn">Llegó ${lateBy} min tarde</span>`);
      if (c.t.llegada && lateBy < -5) badges.push(`<span class="badge">Llegó ${-lateBy} min antes</span>`);
      if (c.phase === "sala" && now > toMin(c.appt)) badges.push(`<span class="badge alert">${now - toMin(c.appt)} min sobre su hora</span>`);
      if (c.alert) badges.push(`<span class="badge alert">${esc(c.alert)}</span>`);
      const timer = c.phase === "fuera" ? `Salió ${c.t.fuera}` : `${mins} min ${c.phase === "gabinete" ? "en gabinete" : "esperando"}`;
      const hot = (c.phase === "sala" || c.phase === "llegada") && mins >= 15;
      return `<div class="ck ${c.phase} ${hot ? "hot" : ""}">
        <div class="ck-top"><span class="ck-time num">${c.appt}</span><span class="ck-timer ${hot ? "hot" : ""}">${timer}</span></div>
        <div class="ck-name">${c.id ? `<a href="#/paciente/${c.id}/ficha">${esc(c.who)}</a>` : esc(c.who)}</div>
        <div class="small muted">${esc(c.what)}${c.t.llegada ? ` · llegó ${c.t.llegada}` : ""}</div>
        ${badges.length ? `<div class="ck-badges">${badges.join("")}</div>` : ""}
        ${phase && phase[2] ? (isAdmin() ? `<button class="btn sm" disabled title="${RO}">${phase[2]} ›</button>` : `<button class="btn sm" data-ck="${i}">${phase[2]} ›</button>`) : ""}
      </div>`;
    };
    return shell("recepcion", `
      <div class="page-head">
        <div><div class="eyebrow">${esc(mem.clinic.name)} · jueves 8 de octubre</div><h1>Recepción</h1></div>
        <span class="now-chip">${ICON.clock}Hora simulada ${NOW}</span>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="k">Citados hoy</span><span class="v">${list.length}</span></div>
        <div class="kpi"><span class="k">En clínica ahora</span><span class="v">${list.filter((c) => ["llegada", "sala", "gabinete"].includes(c.phase)).length}</span></div>
        <div class="kpi ${longest && since(longest) >= 15 ? "hot" : ""}"><span class="k">Más tiempo esperando</span><span class="v">${longest ? `${now - toMin(longest.t.llegada)} min` : "—"}</span><span class="s">${longest ? esc(longest.who) : "Nadie esperando"}</span></div>
        <div class="kpi ${behind.length ? "hot" : ""}"><span class="k">Retraso de consulta</span><span class="v">${behind.length ? `+${Math.max(...behind.map((c) => now - toMin(c.appt)))} min` : "En hora"}</span><span class="s">${behind.length ? `${behind.length} paciente${behind.length > 1 ? "s" : ""} pasado${behind.length > 1 ? "s" : ""} de hora` : ""}</span></div>
      </div>
      ${pending.length ? `<div class="pending-strip"><b>Por llegar:</b> ${pending.map((c) => `<span class="pend-item"><span class="num">${c.appt}</span> ${esc(c.who)}${c.alert ? ` · <span style="color:var(--alert)">${esc(c.alert)}</span>` : ""}${isAdmin() ? "" : ` <button class="link-btn" data-ck-arrive="${list.indexOf(c)}">Marcar llegada</button>`}</span>`).join("")}</div>` : ""}
      <div class="board">${PHASES.map(([k, label]) => {
        const items = list.filter((c) => c.phase === k).sort((a, b) => k === "fuera" ? toMin(b.t.fuera) - toMin(a.t.fuera) : toMin(a.t.llegada || NOW) - toMin(b.t.llegada || NOW));
        return `<section class="col-ph ${k}"><h3>${label}<span class="n">${items.length}</span></h3>${items.map(card).join("") || '<p class="small muted empty">Nadie</p>'}</section>`;
      }).join("")}</div>
      <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Pacientes y horas de ejemplo con una hora fija (${NOW}). Mover a un paciente de fase funciona solo en esta pantalla y se pierde al recargar.</span></div>`);
  }

  /* -------------------------------------------------------- 12. balance */
  function balanceChart() {
    const W = 440, H = 230, pad = { l: 26, r: 6, t: 18, b: 26 };
    const max = 20, bw = 20, gap = 2;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const step = iw / BALANCE_MONTHS.length;
    const y = (v) => pad.t + ih - (v / max) * ih;
    const bar = (x, v, color, label, month) => {
      const top = y(v), h = pad.t + ih - top;
      const d = `M${x} ${pad.t + ih} V${top + 4} Q${x} ${top} ${x + 4} ${top} H${x + bw - 4} Q${x + bw} ${top} ${x + bw} ${top + 4} V${pad.t + ih} Z`;
      return `<path d="${d}" fill="${color}" data-tip="${month}: ${v} ${label}"/><rect x="${x - 3}" y="${pad.t}" width="${bw + 6}" height="${ih}" fill="transparent" data-tip="${month}: ${v} ${label}"/>`;
    };
    const grid = [0, 5, 10, 15, 20].map((v) => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="#E7ECEA"/><text x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end" class="ax">${v}</text>`).join("");
    const bars = BALANCE_MONTHS.map(([m, e, a], i) => {
      const x0 = pad.l + i * step + (step - (bw * 2 + gap)) / 2;
      const last = i === BALANCE_MONTHS.length - 1;
      return `${bar(x0, e, "#B9853A", "emitidos", m)}${bar(x0 + bw + gap, a, "#0F8A7A", "aceptados", m)}
        <text x="${x0 + bw + gap / 2}" y="${H - 8}" text-anchor="middle" class="ax">${m}</text>
        ${last ? `<text x="${x0 + bw / 2}" y="${y(e) - 5}" text-anchor="middle" class="dl">${e}</text><text x="${x0 + bw + gap + bw / 2}" y="${y(a) - 5}" text-anchor="middle" class="dl">${a}</text>` : ""}`;
    }).join("");
    return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" class="bchart" role="img" aria-label="Presupuestos emitidos y aceptados por mes, mayo a octubre">${grid}<line x1="${pad.l}" x2="${W - pad.r}" y1="${pad.t + ih}" y2="${pad.t + ih}" stroke="#CBD3D0"/>${bars}</svg><div class="tip" hidden></div></div>`;
  }
  function viewBalance() {
    if (!isAdmin()) {
      return shell("balance", `<div class="card card-pad empty-state">${ICON.lock}<h2>Solo para Administración</h2><p class="muted">El balance mensual de presupuestos lo ve el rol Administración / Coordinación.</p><a class="btn" href="#/">Cambiar de rol</a></div>`);
    }
    const [, emit, acc] = BALANCE_MONTHS[BALANCE_MONTHS.length - 1];
    const stClass = { aceptado: "st-retencion", pendiente: "st-presupuesto", rechazado: "st-alta" };
    return shell("balance", `
      <div class="page-head">
        <div><div class="eyebrow">${esc(mem.clinic.name)} · Administración</div><h1>Balance de presupuestos · octubre 2026</h1></div>
        <div class="actions"><a class="btn" href="#/paciente/demo/presupuesto">Ir a presupuestos</a></div>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="k">Emitidos</span><span class="v">${emit}</span><span class="s">este mes</span></div>
        <div class="kpi"><span class="k">Aceptados</span><span class="v">${acc}</span><span class="s">${Math.round((acc / emit) * 100)} % de aceptación</span></div>
        <div class="kpi"><span class="k">Importe aceptado</span><span class="v">${eur(7200)}</span><span class="s">este mes</span></div>
        <div class="kpi"><span class="k">Pendientes de respuesta</span><span class="v">5</span><span class="s">2 rechazados</span></div>
      </div>
      <div class="grid-bal">
        <section class="card card-pad">
          <div class="section-title"><h2>Emitidos frente a aceptados</h2>
            <div class="legend-c"><span><i style="background:#B9853A"></i>Emitidos</span><span><i style="background:#0F8A7A"></i>Aceptados</span></div></div>
          ${balanceChart()}
          <details class="tbl-view"><summary>Ver como tabla</summary>
            <table class="qtable"><thead><tr><th>Mes</th><th class="r">Emitidos</th><th class="r">Aceptados</th></tr></thead>
            <tbody>${BALANCE_MONTHS.map(([m, e, a]) => `<tr><td>${m}</td><td class="r">${e}</td><td class="r">${a}</td></tr>`).join("")}</tbody></table>
          </details>
        </section>
        <section class="card card-pad">
          <div class="section-title"><h2>Últimos presupuestos</h2><span class="small muted">7 de ${emit}</span></div>
          <table class="qtable bal-t"><thead><tr><th>Nº</th><th>Paciente</th><th>Profesional</th><th class="r">Importe</th><th>Estado</th></tr></thead>
          <tbody>${BALANCE_ROWS.map(([n, pt, dr, amt, st, d]) => `<tr><td class="num nowrap">${n}<div class="d">${d}</div></td><td>${pt}</td><td>${dr}</td><td class="r">${eur(amt)}</td><td><span class="chip ${stClass[st]}">${st[0].toUpperCase() + st.slice(1)}</span></td></tr>`).join("")}</tbody></table>
        </section>
      </div>
      <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Cifras e importes <b>ficticios</b>, solo para enseñar cómo se vería el balance.</span></div>`, true);
  }
  function chartMount() {
    const wrap = document.querySelector(".chart-wrap");
    if (!wrap) return;
    const tip = wrap.querySelector(".tip");
    wrap.addEventListener("pointermove", (e) => {
      const t = e.target.closest("[data-tip]");
      if (!t) { tip.hidden = true; return; }
      const r = wrap.getBoundingClientRect();
      tip.textContent = t.dataset.tip;
      tip.hidden = false;
      tip.style.left = `${e.clientX - r.left + 12}px`;
      tip.style.top = `${e.clientY - r.top - 8}px`;
    });
    wrap.addEventListener("pointerleave", () => (tip.hidden = true));
  }

  /* -------------------------------------------------------- 13. alta de paciente */
  /* QR de ejemplo (patrón fijo, no codifica nada ni es escaneable). */
  function fakeQR(size = 29) {
    let cells = "";
    const finder = (x, y) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (finder(x, y)) continue;
      const r = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      if (r > 0.52) cells += `M${x} ${y}h1v1h-1z`;
    }
    const fp = (x, y) => `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" fill="none" stroke="#1C2725" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1C2725"/>`;
    return `<svg viewBox="-2 -2 ${size + 4} ${size + 4}" class="qr" role="img" aria-label="Código QR de ejemplo, no escaneable"><rect x="-2" y="-2" width="${size + 4}" height="${size + 4}" fill="#fff"/><path d="${cells}" fill="#1C2725"/>${fp(0, 0)}${fp(size - 7, 0)}${fp(0, size - 7)}</svg>`;
  }
  const ALTA_STEPS = ["Enlace generado", "Enviado al tutor", "Cuestionario rellenado", "Anexado a la ficha"];
  function viewAlta() {
    if (isAdmin()) return shell("pacientes", `<div class="card card-pad empty-state">${ICON.lock}<h2>Solo lectura</h2><p class="muted">El rol Administración no da de alta pacientes en esta demo.</p></div>`);
    const a = (mem.alta ||= { mode: "enlace", step: 1 });
    const demoNew = { name: "Paciente Nuevo Ejemplo", born: "11/02/2017", phone: "600 000 071", email: "familia.nueva@ejemplo.test", reason: "Dientes torcidos arriba, nos lo dijo su dentista.", allergies: [], conditions: [], meds: [], history: "Ninguno", tutors: [T("Tutora Ejemplo J", "Madre · tutora legal", "600 000 072", true, true, true)], family: { separated: false, custody: "Un único tutor" } };
    const flow = `<div class="alta-flow">
        <div class="card card-pad qr-card">
          ${fakeQR()}
          <div class="qr-meta">
            <div class="eyebrow">Enlace de alta · uso único</div>
            <div class="qr-link num">enlace-de-ejemplo.test/alta/7F3K-Q2</div>
            <div class="actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <button class="btn" data-demo="Enlace copiado (simulado)">Copiar enlace</button>
              <button class="btn" data-demo="Envío por WhatsApp simulado: no se envía nada">Enviar por WhatsApp</button>
            </div>
            <p class="small muted" style="margin-top:8px">El tutor lo abre en su móvil, rellena el cuestionario y firma la protección de datos. La recepción no transcribe nada.</p>
          </div>
        </div>
        <ol class="alta-steps">${ALTA_STEPS.map((s, i) => `<li class="${i < a.step ? "done" : i === a.step ? "next" : ""}"><span class="sdot">${i < a.step ? "✓" : i + 1}</span>${s}</li>`).join("")}</ol>
        ${a.step < 4 ? `<button class="btn primary" data-alta-step>${a.step < 2 ? "Simular envío al tutor" : a.step < 3 ? "Simular que el tutor lo rellena" : "Anexar a la ficha"} ›</button>`
          : `<div class="card card-pad alta-done">
              <div class="linked">${ICON.qr}<div><b>Ficha creada: ${demoNew.name}</b><div class="small muted">Cuestionario recibido 08/10/2026 17:44 · anexado automáticamente, sin transcribir</div></div></div>
              ${intakeForm(demoNew, { locked: true })}
              <p class="small muted" style="margin-top:10px">Ficha provisional solo de esta pantalla: no se añade al listado y se pierde al recargar.</p>
              <button class="btn" data-alta-reset>Empezar otra alta</button>
            </div>`}
      </div>`;
    const phone = `<div class="phone" aria-label="Así lo ve el tutor en su móvil">
        <div class="phone-in">
          <div class="phone-head">${arch({ w: 30, h: 20, n: 6, r: 2.2 })}<span>${esc(mem.clinic.name.split(" · ")[0])}</span></div>
          <div class="phone-title">Cuestionario de alta</div>
          <div class="phone-sub">Tarda unos 3 minutos</div>
          ${["Nombre del paciente", "Fecha de nacimiento", "¿Alergias?", "¿Toma alguna medicación?", "Tutor legal", "¿Padres separados?"].map((l, i) => `<div class="p-fld"><span>${l}</span><i style="width:${[70, 45, 55, 60, 65, 30][i]}%"></i></div>`).join("")}
          <div class="p-btn">Enviar a la clínica</div>
        </div>
      </div>`;
    return shell("pacientes", `
      <a class="back" href="#/pacientes">‹ Pacientes</a>
      <div class="page-head"><div><div class="eyebrow">${esc(mem.clinic.name)}</div><h1>Nuevo paciente</h1></div></div>
      <div class="seg alta-mode" role="group" aria-label="Forma de alta">
        <button data-alta-mode="enlace" aria-pressed="${a.mode === "enlace"}">Enviar enlace / QR al paciente</button>
        <button data-alta-mode="manual" aria-pressed="${a.mode === "manual"}">Crear ficha manualmente</button>
      </div>
      ${a.mode === "enlace"
        ? `<div class="alta-grid">${flow}${phone}</div>`
        : `<div class="card card-pad" style="max-width:860px"><div class="section-title"><h2>Ficha manual</h2><button class="btn primary" data-demo="Alta manual simulada: la demo no guarda nada">Crear ficha</button></div>${intakeForm(null, { blank: true })}</div>`}
      <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Flujo simulado: el QR y el enlace son de ejemplo, no se envía ni se recibe nada.</span></div>`);
  }

  /* ---------------------------------------------------------------- router */
  function render() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    let html;
    if (!parts.length) html = viewLogin();
    else if (parts[0] === "pacientes") html = viewPatients();
    else if (parts[0] === "agenda") html = viewAgenda();
    else if (parts[0] === "recepcion") html = viewRecepcion();
    else if (parts[0] === "balance") html = viewBalance();
    else if (parts[0] === "alta") html = viewAlta();
    else if (parts[0] === "paciente") {
      const p = patient(parts[1]);
      const tab = parts[2] || "ficha";
      if (mem._pid !== p.id) { mem._pid = p.id; mem.dentition = null; mem.selectedTooth = null; }
      if (!canSee(p)) html = viewNoAccess(p);
      else if (tab === "documentos") html = viewDocumentos(p, parts[3]);
      else html = ({ fotos: viewFotos, odontograma: viewOdontograma, cefalometria: viewCefalometria, presupuesto: viewPresupuesto, laboratorio: viewLaboratorio }[tab] || viewFicha)(p);
    } else html = viewLogin();
    $app.innerHTML = html;
    cephMount();
    docMount();
    chartMount();
    document.title = (parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) + " · " : "") + "Ortodoncia · Demo visual";
  }

  function rerender() {
    const y = window.scrollY;
    render();
    const v = $app.querySelector(".view");
    if (v) v.style.animation = "none";
    window.scrollTo(0, y);
  }

  const hhmm = () => NOW;
  $app.addEventListener("click", (e) => {
    const t = e.target;
    const role = t.closest("[data-role]");
    if (role) { mem.role = role.dataset.role; mem.filter = "todos"; rerender(); return; }
    const clinic = t.closest("[data-clinic]");
    if (clinic) { mem.clinic = CLINICS.find((c) => c.id === clinic.dataset.clinic); location.hash = "#/pacientes"; return; }
    const go = t.closest("[data-go]");
    if (go) { location.hash = go.dataset.go; return; }
    const demo = t.closest("[data-demo]");
    if (demo) { toast(demo.dataset.demo); return; }
    const f = t.closest("[data-filter]");
    if (f) { mem.filter = f.dataset.filter; rerender(); if (f.dataset.filter !== "todos") toast("Filtro visual: en la demo no filtra la lista"); return; }
    const sc = t.closest("[data-scope]");
    if (sc) { mem.agendaScope = sc.dataset.scope; rerender(); return; }
    const dn = t.closest("[data-dent]");
    if (dn) { mem.dentition = dn.dataset.dent; mem.selectedTooth = null; rerender(); return; }
    const th = t.closest("[data-tooth]");
    if (th) { mem.selectedTooth = Number(th.dataset.tooth); rerender(); return; }
    const st = t.closest("[data-state]");
    if (st && mem.selectedTooth && !isAdmin()) {
      const p = patient(mem._pid);
      mem.teeth[`${p.id}:${mem.dentition || p.dentition}:${mem.selectedTooth}`] = st.dataset.state;
      rerender();
      return;
    }
    const sh = t.closest("[data-share]");
    if (sh) {
      const id = sh.dataset.share;
      if (mem.shared[id]) delete mem.shared[id]; else { mem.shared[id] = hhmm(); toast("Compartido con recepción (simulado)"); }
      rerender();
      return;
    }
    const sc2 = t.closest("[data-sig-clear]");
    if (sc2) { const s = mem.signatures[mem._pid]; if (s) delete s[sc2.dataset.sigClear]; rerender(); return; }
    const lab = t.closest("[data-lab]");
    if (lab) {
      const [pid, i] = lab.dataset.lab.split(":");
      const a = mem.lab[pid][Number(i)];
      a.dates[a.dates.findIndex((d) => !d)] = "08/10/2026";
      rerender();
      return;
    }
    const ck = t.closest("[data-ck]");
    if (ck) {
      const c = mem.checkin[Number(ck.dataset.ck)];
      const order = PHASES.map(([k]) => k);
      const next = order[order.indexOf(c.phase) + 1];
      c.phase = next; c.t[next] = NOW;
      rerender();
      return;
    }
    const arrive = t.closest("[data-ck-arrive]");
    if (arrive) { const c = mem.checkin[Number(arrive.dataset.ckArrive)]; c.phase = "llegada"; c.t.llegada = NOW; rerender(); return; }
    const am = t.closest("[data-alta-mode]");
    if (am) { mem.alta.mode = am.dataset.altaMode; rerender(); return; }
    if (t.closest("[data-alta-step]")) { mem.alta.step = Math.min(4, mem.alta.step + (mem.alta.step === 2 ? 2 : 1)); rerender(); return; }
    if (t.closest("[data-alta-reset]")) { mem.alta = { mode: "enlace", step: 1 }; rerender(); return; }
  });
  $app.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-go]")) { e.preventDefault(); e.target.click(); }
  });
  $app.addEventListener("input", (e) => {
    if (e.target.matches("#ba input")) document.getElementById("ba").style.setProperty("--pos", e.target.value + "%");
  });

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  render();
})();
