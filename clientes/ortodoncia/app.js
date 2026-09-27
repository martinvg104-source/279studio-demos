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

  const PATIENTS = [
    {
      id: "demo", name: "Paciente Demo", initials: "PD", age: 11, born: "14/03/2015", hc: "HC-0001",
      state: "tratamiento", dentition: "mixta", next: "Jue 8 oct · 17:30", last: "Hace 4 semanas",
      phone: "600 000 001", email: "tutor@ejemplo.test",
      allergies: ["Látex"], conditions: ["Asma leve (inhalador de rescate)"],
      reason: "Apiñamiento anterior y mordida cruzada posterior derecha. Derivado por su dentista general.",
      history: "Sin cirugías previas. Respiración oral nocturna referida por los tutores.",
      meds: "Salbutamol inhalado, a demanda",
      tutors: [
        { name: "Tutora Ejemplo A", role: "Madre · tutora legal", phone: "600 000 002" },
        { name: "Tutor Ejemplo B", role: "Padre · tutor legal", phone: "600 000 003" },
      ],
      custody: "Custodia compartida — ambos tutores reciben presupuestos y avisos de cita.",
    },
    {
      id: "lucia", name: "Lucía Ejemplo", initials: "LE", age: 8, born: "02/06/2018", hc: "HC-0002",
      state: "estudio", dentition: "temporal", next: "Lun 5 oct · 10:00", last: "Primera visita",
      phone: "600 000 011", email: "familia.lucia@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Primera valoración. Hábito de succión digital.",
      history: "Sin antecedentes relevantes.", meds: "Ninguna",
      tutors: [{ name: "Tutor Ejemplo C", role: "Padre · tutor legal", phone: "600 000 012" }],
      custody: "Un único tutor con autorización registrada.",
    },
    {
      id: "mateo", name: "Mateo Prueba", initials: "MP", age: 14, born: "21/11/2011", hc: "HC-0003",
      state: "presupuesto", dentition: "permanente", next: "Jue 8 oct · 18:30", last: "Hace 1 semana",
      phone: "600 000 021", email: "familia.mateo@ejemplo.test",
      allergies: ["Penicilina"], conditions: [],
      reason: "Clase II división 1, resalte aumentado.",
      history: "Traumatismo en 11 a los 9 años, sin secuelas.", meds: "Ninguna",
      tutors: [{ name: "Tutora Ejemplo D", role: "Madre · tutora legal", phone: "600 000 022" }],
      custody: "Un único tutor con autorización registrada.",
    },
    {
      id: "ana", name: "Ana Ficticia", initials: "AF", age: 17, born: "09/01/2009", hc: "HC-0004",
      state: "retencion", dentition: "permanente", next: "Sáb 10 oct · 10:30", last: "Hace 3 meses",
      phone: "600 000 031", email: "ana@ejemplo.test",
      allergies: [], conditions: [],
      reason: "Revisión de retención tras aparatología fija.",
      history: "Tratamiento finalizado en 2026.", meds: "Ninguna",
      tutors: [{ name: "Tutora Ejemplo E", role: "Madre · tutora legal", phone: "600 000 032" }],
      custody: "Un único tutor con autorización registrada.",
    },
    {
      id: "carlos", name: "Carlos Muestra", initials: "CM", age: 34, born: "30/07/1992", hc: "HC-0005",
      state: "alta", dentition: "permanente", next: "—", last: "Hace 8 meses",
      phone: "600 000 041", email: "carlos@ejemplo.test",
      allergies: [], conditions: ["Bruxismo"],
      reason: "Alineadores estéticos por recidiva leve.",
      history: "Ortodoncia en la adolescencia.", meds: "Ninguna",
      tutors: [], custody: "",
    },
  ];

  const DOCTOR = "Dr. Ejemplo";

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
    [3, "17:30", 45, "Paciente Demo", "Revisión + fotos de control", "revision", "ok"],
    [3, "18:30", 45, "Mateo Prueba", "Entrega de presupuesto", "estudio", "pend"],
    [5, "09:30", 30, "Paciente 19", "Revisión", "revision", "ok"],
    [5, "10:30", 30, "Ana Ficticia", "Control de retención", "retencion", "ok"],
    [5, "11:30", 60, "Paciente 20", "Retirada de aparatología", "retencion", "no"],
  ];
  const REMINDER = { ok: "Confirmada por WhatsApp", pend: "Recordatorio enviado", no: "Sin respuesta" };

  /* ----------------------------------------------------------- estado vivo */
  const mem = { clinic: CLINICS[0], agendaScope: "sede", teeth: {}, selectedTooth: null, dentition: null, filter: "todos" };

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
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/></svg>',
  };

  /* ---------------------------------------------------------------- shell */
  function shell(section, inner) {
    const c = mem.clinic;
    return `<div class="shell">
      <aside class="side">
        <div class="brand">${arch({ w: 38, h: 26, n: 7, r: 2.6 })}
          <div><div class="bname">${esc(c.name.split(" · ")[0])}</div><div class="bsub">${esc(c.name.split(" · ")[1] || "Sede principal")}</div></div>
        </div>
        <nav class="nav" aria-label="Secciones">
          <a href="#/pacientes" ${section === "pacientes" ? 'aria-current="page"' : ""}>${ICON.users}<span>Pacientes</span></a>
          <a href="#/agenda" ${section === "agenda" ? 'aria-current="page"' : ""}>${ICON.cal}<span>Agenda</span></a>
          <a href="#/" title="Cambiar de clínica">${ICON.swap}<span>Cambiar clínica</span></a>
        </nav>
        <div class="who"><span class="avatar">DE</span><div><div class="n">${DOCTOR}</div><a href="#/">Salir</a></div></div>
      </aside>
      <main class="main"><div class="view">${inner}</div></main>
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
        <h2>¿En qué clínica pasas consulta hoy?</h2>
        <p class="muted small" style="margin-bottom:6px">${DOCTOR} · acceso de ejemplo, sin contraseña</p>
        ${CLINICS.map((c) => `<button class="clinic-card" data-clinic="${c.id}">
          <span class="clinic-mark">${arch({ w: 30, h: 20, n: 6, r: 2.2 })}</span>
          <span class="meta"><span class="name">${esc(c.name)}</span><br><span class="sub">${esc(c.sub)}</span></span>
          <span class="go" aria-hidden="true">›</span>
        </button>`).join("")}
        <p class="login-foot">Los pacientes pertenecen a cada clínica; el profesional puede trabajar en varias sedes.</p>
      </div>
    </div></div>`;
  }

  /* ------------------------------------------------ 2. listado de pacientes */
  function viewPatients() {
    const counts = Object.keys(STATES).reduce((a, k) => ((a[k] = PATIENTS.filter((p) => p.state === k).length), a), {});
    const filters = [["todos", "Todos", PATIENTS.length], ...Object.entries(STATES).map(([k, v]) => [k, v, counts[k]])];
    const alertCell = (p) => (p.allergies.length ? `<span class="flag">${ICON.warn.replace("<svg", '<svg width="14" height="14"')}Alergia: ${esc(p.allergies.join(", "))}</span>` : `<span class="muted small">—</span>`);
    return shell("pacientes", `
      <div class="page-head">
        <div><div class="eyebrow">${esc(mem.clinic.name)}</div><h1>Pacientes</h1></div>
        <div class="actions"><button class="btn primary" data-demo="Alta de paciente desactivada en la demo">+ Nuevo paciente</button></div>
      </div>
      <div class="toolbar">
        <label class="search">${ICON.search}<input type="search" placeholder="Buscar por nombre o nº de historia" aria-label="Buscar paciente"></label>
      </div>
      <div class="filters" role="group" aria-label="Filtrar por estado" style="margin-bottom:16px">
        ${filters.map(([k, label, n]) => `<button class="filter" data-filter="${k}" aria-pressed="${mem.filter === k}">${label} <span class="c">${n}</span></button>`).join("")}
      </div>
      <div class="card ptable-wrap"><table class="ptable">
        <thead><tr><th>Paciente</th><th>Estado</th><th>Próxima cita</th><th>Alertas</th><th>Última visita</th></tr></thead>
        <tbody>${PATIENTS.map((p) => `<tr data-go="#/paciente/${p.id}/ficha">
          <td><div class="pname"><span class="avatar">${p.initials}</span><div><div class="n">${esc(p.name)}</div><div class="s">${p.age} años · ${p.hc}</div></div></div></td>
          <td><span class="chip st-${p.state}">${STATES[p.state]}</span></td>
          <td class="num">${p.next}</td><td>${alertCell(p)}</td><td class="muted">${p.last}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      <div class="plist-cards">${PATIENTS.map((p) => `<div class="card pcard" data-go="#/paciente/${p.id}/ficha">
        <div class="pname"><span class="avatar">${p.initials}</span><div><div class="n">${esc(p.name)}</div><div class="s">${p.age} años · ${p.hc}</div></div></div>
        <div class="row"><span class="chip st-${p.state}">${STATES[p.state]}</span><span class="small muted">Próxima: ${p.next}</span></div>
        ${p.allergies.length ? `<div>${alertCell(p)}</div>` : ""}
      </div>`).join("")}</div>`);
  }

  /* ------------------------------------------------- cabecera de paciente */
  const PTABS = [["ficha", "Ficha"], ["fotos", "Fotos clínicas"], ["odontograma", "Odontograma"], ["cefalometria", "Cefalometría"], ["presupuesto", "Presupuesto"]];
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
          <div class="facts"><span>${p.age} años</span><span>${p.hc}</span><span>${DOCTOR}</span><span>Próxima cita: ${p.next}</span></div>
        </div>
        <span class="chip st-${p.state}">${STATES[p.state]}</span>
      </div>
      <nav class="tabs" aria-label="Secciones del paciente">
        ${PTABS.map(([k, l]) => `<a href="#/paciente/${p.id}/${k}" ${k === tab ? 'aria-current="page"' : ""}>${l}</a>`).join("")}
      </nav>
      ${inner}`);
  }

  /* --------------------------------------------------- 3. ficha de paciente */
  function viewFicha(p) {
    const tutors = p.tutors.length
      ? `<div class="tutors">${p.tutors.map((t) => `<div class="tutor"><span class="avatar">${t.name.split(" ").pop()[0]}</span><div><div class="n">${esc(t.name)}</div><div class="r">${esc(t.role)} · ${t.phone}</div></div></div>`).join("")}</div>
         <div class="custody">${ICON.info}${esc(p.custody)}</div>`
      : `<p class="muted">Paciente mayor de edad: sin tutor legal.</p>`;
    return patientFrame(p, "ficha", `
      <div class="grid-3">
        <div style="display:grid;gap:16px">
          <section class="card card-pad">
            <div class="section-title"><h2>Datos personales</h2><button class="btn" data-demo="Edición desactivada en la demo">Editar</button></div>
            <dl class="dl">
              <dt>Fecha de nacimiento</dt><dd class="num">${p.born} (${p.age} años)</dd>
              <dt>Teléfono</dt><dd class="num">${p.phone}</dd>
              <dt>Email</dt><dd>${esc(p.email)}</dd>
              <dt>Clínica</dt><dd>${esc(mem.clinic.name)}</dd>
              <dt>Profesional</dt><dd>${DOCTOR}</dd>
            </dl>
          </section>
          <section class="card card-pad">
            <div class="section-title"><h2>Datos médicos</h2></div>
            <dl class="dl">
              <dt>Motivo de consulta</dt><dd>${esc(p.reason)}</dd>
              <dt>Alergias</dt><dd>${p.allergies.length ? `<b style="color:var(--alert)">${esc(p.allergies.join(", "))}</b>` : "No refiere"}</dd>
              <dt>Patología</dt><dd>${p.conditions.length ? esc(p.conditions.join(", ")) : "No refiere"}</dd>
              <dt>Medicación</dt><dd>${esc(p.meds)}</dd>
              <dt>Antecedentes</dt><dd>${esc(p.history)}</dd>
              <dt>Dentición</dt><dd>${p.dentition[0].toUpperCase() + p.dentition.slice(1)}</dd>
            </dl>
          </section>
        </div>
        <div style="display:grid;gap:16px;align-content:start">
          <section class="card card-pad">
            <div class="section-title"><h2>Tutor legal</h2></div>
            ${tutors}
          </section>
          <section class="card card-pad">
            <div class="section-title"><h2>Evolución</h2></div>
            <ul class="timeline">
              <li class="done"><span class="tdot"></span><div>Primera visita y registros<div class="when">Marzo 2026</div></div></li>
              <li class="done"><span class="tdot"></span><div>Presupuesto aceptado<div class="when">Abril 2026</div></div></li>
              <li class="done"><span class="tdot"></span><div>Colocación de aparatología<div class="when">Mayo 2026</div></div></li>
              <li><span class="tdot"></span><div>Revisión + fotos de control<div class="when">Jue 8 oct 2026</div></div></li>
            </ul>
          </section>
          <div class="demo-note">${ICON.info}<span>Consentimientos y protección de datos: <b>proceso pendiente de definir</b> con las clínicas.</span></div>
        </div>
      </div>`);
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
        <div class="actions"><button class="btn" data-demo="Navegación de semanas desactivada en la demo">‹</button><button class="btn" data-demo="Navegación de semanas desactivada en la demo">Hoy</button><button class="btn" data-demo="Navegación de semanas desactivada en la demo">›</button><button class="btn primary" data-demo="Crear cita desactivado en la demo">+ Nueva cita</button></div>
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
  function viewPresupuesto(p) {
    const lines = [
      ["Estudio de ortodoncia", "Registros, fotografías, modelos y estudio cefalométrico", 1, 150],
      ["Aparatología fija superior e inferior", "Brackets metálicos convencionales", 1, 1800],
      ["Revisiones mensuales", "Controles y activaciones durante el tratamiento", 18, 60],
      ["Retención", "Retenedor fijo inferior + férula superior", 1, 250],
    ];
    const total = lines.reduce((s, l) => s + l[2] * l[3], 0);
    const down = 480;
    return patientFrame(p, "presupuesto", `
      <div class="card card-pad quote">
        <div class="quote-head">
          <div>${arch({ w: 40, h: 26, n: 7, r: 2.6 })}<h2 style="margin-top:8px">${esc(mem.clinic.name)}</h2><p class="small muted">Presupuesto de tratamiento de ortodoncia</p></div>
          <div class="ref"><div class="eyebrow">Nº presupuesto</div><div class="num" style="font-weight:600">P-2026-0042</div><span class="chip st-presupuesto" style="margin-top:8px">Pendiente de aceptar</span></div>
        </div>
        <div class="quote-meta">
          <div><div class="eyebrow">Paciente</div><div class="v">${esc(p.name)}</div></div>
          <div><div class="eyebrow">Doctor</div><div class="v">${DOCTOR}</div></div>
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
        <div class="sign"><div>Firma del paciente o tutor legal</div><div>${DOCTOR} · Nº colegiado 00000</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:22px">
          <button class="btn primary" data-demo="Envío desactivado en la demo">Enviar a los tutores</button>
          <button class="btn" data-demo="Descarga desactivada en la demo">Descargar PDF</button>
        </div>
        <div class="demo-note" style="margin-top:16px">${ICON.info}<span>Importes y tratamientos <b>de ejemplo</b>, no son tarifas de ninguna clínica.</span></div>
      </div>`);
  }

  /* -------------------------------------------------------- 7. odontograma */
  const TOOTH_STATES = {
    sano: { label: "Sano", fill: "#FFFFFF", stroke: "#B9C3C0" },
    caries: { label: "Caries", fill: "#F3D6CB", stroke: "#A9492F" },
    obturado: { label: "Obturado", fill: "#CFE3E0", stroke: "#3E7A74" },
    erupcion: { label: "En erupción", fill: "#F5EBD2", stroke: "#9A6A12", dash: "3 2" },
    ausente: { label: "Ausente", fill: "transparent", stroke: "#B9C3C0", dash: "2 3" },
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
  function toothWidth(n) {
    const q = Math.floor(n / 10), d = n % 10;
    if (q >= 5) return [0, 0.8, 0.72, 0.8, 1.0, 1.15][d];
    return [0, 1.0, 0.85, 0.9, 0.88, 0.88, 1.25, 1.18, 1.1][d];
  }
  function archLayout(list, upper) {
    const W = list.reduce((s, n) => s + toothWidth(n), 0);
    const span = list.length > 12 ? 2.9 : list.length > 10 ? 2.6 : 2.3;
    const cx = 400, Rx = 300, Ry = 190, cy = upper ? 275 : 345;
    let cum = 0;
    return list.map((n) => {
      const w = toothWidth(n);
      const a = -span / 2 + (span * (cum + w / 2)) / W;
      cum += w;
      const sx = Math.sin(a), cs = Math.cos(a);
      const x = cx + Rx * sx, y = upper ? cy - Ry * cs : cy + Ry * cs;
      const lx = cx + (Rx + 42) * sx, ly = upper ? cy - (Ry + 38) * cs : cy + (Ry + 38) * cs;
      const deg = ((upper ? a : -a) * 180) / Math.PI;
      return { n, x, y, lx, ly, deg, w: w * 40 };
    });
  }
  function viewOdontograma(p) {
    const dentKey = mem.dentition || p.dentition;
    const dent = DENT[dentKey];
    const key = (n) => `${p.id}:${dentKey}:${n}`;
    const state = (n) => mem.teeth[key(n)] || dent.init[n] || "sano";
    const tooth = (t) => {
      const s = TOOTH_STATES[state(t.n)];
      const sel = mem.selectedTooth === t.n;
      return `<g class="tooth ${sel ? "sel" : ""}" data-tooth="${t.n}" tabindex="0" role="button" aria-label="Pieza ${t.n}: ${s.label}">
        <rect x="${-t.w / 2}" y="-24" width="${t.w}" height="48" rx="${t.w / 3}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.6" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} transform="translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${t.deg.toFixed(1)})"/>
        <text x="${t.lx.toFixed(1)}" y="${(t.ly + 4).toFixed(1)}" text-anchor="middle">${t.n}</text>
      </g>`;
    };
    const up = archLayout(dent.up, true), low = archLayout(dent.low, false);
    const sel = mem.selectedTooth && [...dent.up, ...dent.low].includes(mem.selectedTooth) ? mem.selectedTooth : null;
    return patientFrame(p, "odontograma", `
      <div class="agenda-bar">
        <div class="seg" role="group" aria-label="Dentición">
          ${["temporal", "mixta", "permanente"].map((k) => `<button data-dent="${k}" aria-pressed="${k === dentKey}">${k === "temporal" ? "Temporal (leche)" : k[0].toUpperCase() + k.slice(1)}</button>`).join("")}
        </div>
        <span class="small muted">Numeración FDI · vista del profesional</span>
      </div>
      <div class="odo-layout">
        <div class="card card-pad">
          <svg class="odo-svg" viewBox="0 20 800 580" role="group" aria-label="Odontograma">
            <text x="400" y="310" text-anchor="middle" style="font:500 12px var(--sans);fill:#9AA6A2;letter-spacing:.08em">DERECHA DEL PACIENTE ←   → IZQUIERDA</text>
            <line x1="400" y1="40" x2="400" y2="580" stroke="#E1E6E4" stroke-dasharray="3 5"/>
            ${up.map(tooth).join("")}${low.map(tooth).join("")}
          </svg>
        </div>
        <div class="card card-pad">
          <h3>${sel ? `Pieza ${sel}` : "Selecciona una pieza"}</h3>
          <p class="small muted" style="margin:4px 0 14px">${sel ? "Marca el estado. Solo se ve en esta pantalla." : "Toca un diente del arco para marcar su estado."}</p>
          <div class="odo-legend">
            ${Object.entries(TOOTH_STATES).map(([k, s]) => `<button class="state-btn" data-state="${k}" ${sel ? "" : "disabled"} aria-pressed="${sel ? state(sel) === k : false}"><span class="sw" style="background:${s.fill};border-color:${s.stroke};${s.dash ? "border-style:dashed" : ""}"></span>${s.label}</button>`).join("")}
          </div>
          <div class="demo-note" style="margin-top:14px">${ICON.info}<span>Registro visual de apoyo: lo interpreta y valida el profesional. <b>Los cambios no se guardan</b> al recargar. Índice de riesgo de caries: pendiente de confirmar con las clínicas.</span></div>
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

  /* ---------------------------------------------------------------- router */
  function render() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    let html;
    if (!parts.length) html = viewLogin();
    else if (parts[0] === "pacientes") html = viewPatients();
    else if (parts[0] === "agenda") html = viewAgenda();
    else if (parts[0] === "paciente") {
      const p = patient(parts[1]);
      const tab = parts[2] || "ficha";
      if (mem._pid !== p.id) { mem._pid = p.id; mem.dentition = null; mem.selectedTooth = null; }
      html = ({ fotos: viewFotos, odontograma: viewOdontograma, cefalometria: viewCefalometria, presupuesto: viewPresupuesto }[tab] || viewFicha)(p);
    } else html = viewLogin();
    $app.innerHTML = html;
    cephMount();
    document.title = (parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) + " · " : "") + "Ortodoncia · Demo visual";
  }

  function rerender() {
    const y = window.scrollY;
    render();
    const v = $app.querySelector(".view");
    if (v) v.style.animation = "none";
    window.scrollTo(0, y);
  }

  $app.addEventListener("click", (e) => {
    const t = e.target;
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
    if (st && mem.selectedTooth) {
      const p = patient(mem._pid);
      mem.teeth[`${p.id}:${mem.dentition || p.dentition}:${mem.selectedTooth}`] = st.dataset.state;
      rerender();
    }
  });
  $app.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-tooth], [data-go]")) { e.preventDefault(); e.target.click(); }
  });
  $app.addEventListener("input", (e) => {
    if (e.target.matches("#ba input")) document.getElementById("ba").style.setProperty("--pos", e.target.value + "%");
  });

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  render();
})();
