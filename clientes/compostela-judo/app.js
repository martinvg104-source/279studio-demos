/* Compostela Judo Club — app-shell de reservas. Vanilla JS, sin dependencias.
   Router por hash + vistas + wizard de reserva (7 pasos) + panel del club.
   Todo el estado es local de sesión: no hay backend, nada se envía ni se guarda. */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function activityById(id) { return ACTIVITIES.filter(function (a) { return a.id === id; })[0]; }
  function todayDate() { return new Date(); }
  function isoDate(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function formatHuman(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  }
  var DOW = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  function dowIndex(d) { return (d.getDay() + 6) % 7; }
  function genReservationId() { return "RES-" + (1000 + Math.floor(Math.random() * 9000)); }

  var ICONS = {
    home: ["M4 11 L12 4 L20 11", "M6 10 V20 H18 V10"],
    plus: ["M12 5 V19", "M5 12 H19"],
    list: ["M4 6 H20", "M4 12 H20", "M4 18 H12"],
    grid: ["M4 4 H10 V10 H4 Z", "M14 4 H20 V10 H14 Z", "M4 14 H10 V20 H4 Z", "M14 14 H20 V20 H14 Z"],
    calendar: ["M4 5 H20 V21 H4 Z", "M4 9 H20", "M8 3 V7", "M16 3 V7"],
    user: ["M12 12 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0", "M4 21 a 8 8 0 0 1 16 0"],
    check: ["M4 13 L9 18 L20 6"],
    close: ["M6 6 L18 18", "M18 6 L6 18"],
    chevronLeft: ["M15 5 L8 12 L15 19"],
    chevronRight: ["M9 5 L16 12 L9 19"],
    bell: ["M6 8 a6 6 0 0 1 12 0 c0 4 1.5 5.5 2 6 H4 c0.5 -0.5 2 -2 2 -6 Z", "M10 19 a2 2 0 0 0 4 0"],
    bolt: ["M13 2 L4 14 H11 L10 22 L20 9 H13 Z"],
    settings: ["M4 6 H20", "M8 6 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0", "M4 12 H20", "M16 12 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0", "M4 18 H20", "M10 18 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0"]
  };
  function icon(name) {
    var paths = (ICONS[name] || []).map(function (d) { return '<path d="' + d + '" />'; }).join("");
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }

  /* ---------------- toast ---------------- */
  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3200);
  }

  /* ---------------- modal ---------------- */
  var modalOverlay = $("#modalOverlay");
  var modalBody = $("#modalBody");
  var modalLastFocus = null;
  function openModal(title, bodyHtml) {
    modalLastFocus = document.activeElement;
    modalBody.innerHTML =
      '<div class="modal-head"><h2 id="modalTitle">' + title + '</h2>' +
      '<button type="button" class="modal-close" id="modalCloseBtn" aria-label="Cerrar">' + icon("close") + "</button></div>" +
      bodyHtml;
    modalOverlay.hidden = false;
    $("#modalCloseBtn", modalBody).addEventListener("click", closeModal);
    var first = modalBody.querySelector("input, select, textarea, button:not(.modal-close)");
    if (first) first.focus();
  }
  function closeModal() {
    modalOverlay.hidden = true;
    modalBody.innerHTML = "";
    if (modalLastFocus) modalLastFocus.focus();
  }
  modalOverlay.addEventListener("click", function (ev) { if (ev.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !modalOverlay.hidden) closeModal();
  });

  /* ---------------- topbar back ---------------- */
  var topbarBack = $("#topbarBack");
  function setBackHandler(fn) {
    topbarBack.hidden = false;
    topbarBack.onclick = fn;
  }
  function clearBackHandler() {
    topbarBack.hidden = true;
    topbarBack.onclick = null;
  }

  /* ---------------- router ---------------- */
  var TITLES = {
    inicio: "Inicio", reservar: "Reservar", "mis-reservas": "Mis reservas", actividades: "Actividades",
    horarios: "Horarios", avisos: "Avisos", perfil: "Perfil",
    resumen: "Resumen", "admin-reservas": "Reservas", "admin-calendario": "Calendario",
    "admin-alumnos": "Alumnos", "admin-grupos": "Grupos y actividades", "admin-avisos": "Avisos y comunicaciones",
    "admin-automatizaciones": "Automatizaciones", "admin-config": "Configuración"
  };
  var VIEWS = {
    inicio: renderInicio, reservar: renderReservar, "mis-reservas": renderMisReservas, actividades: renderActividades,
    horarios: renderHorarios, avisos: renderAvisosAlumno, perfil: renderPerfil,
    resumen: renderResumen, "admin-reservas": renderAdminReservas, "admin-calendario": renderAdminCalendario,
    "admin-alumnos": renderAdminAlumnos, "admin-grupos": renderAdminGrupos, "admin-avisos": renderAdminAvisos,
    "admin-automatizaciones": renderAdminAutomatizaciones, "admin-config": renderAdminConfig
  };
  var viewRoot = $("#viewRoot");
  var topbarTitle = $("#topbarTitle");

  function currentRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    return VIEWS[h] ? h : "inicio";
  }
  function updateNavActive(route) {
    $all("[data-route]").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-route") === route);
    });
  }
  var EXTRA_ROUTES_BY_ROLE = { alumno: ["horarios"], admin: [] };
  function renderRoute() {
    if (!CURRENT_USER) return;
    var route = currentRoute();
    var allowed = navItemsForRole(CURRENT_USER.role).map(function (i) { return i.route; }).concat(EXTRA_ROUTES_BY_ROLE[CURRENT_USER.role] || []);
    if (allowed.indexOf(route) === -1) {
      route = defaultRouteForRole(CURRENT_USER.role);
      location.hash = "#/" + route;
      return; // the hashchange this triggers re-enters renderRoute with the allowed route
    }
    updateNavActive(route);
    topbarTitle.textContent = TITLES[route];
    clearBackHandler();
    viewRoot.innerHTML = "";
    VIEWS[route](viewRoot);
    viewRoot.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", renderRoute);

  function renderNavLinks(container, items, extraClass) {
    var scroll = items.length > 6;
    container.classList.toggle("bottom-nav-scroll", scroll);
    container.innerHTML = items.map(function (item) {
      var count = item.badgeKey === "avisos" ? unreadAvisosCount() : 0;
      var badge = count > 0 ? '<span class="nav-badge">' + count + "</span>" : "";
      return '<a href="#/' + item.route + '" data-route="' + item.route + '" class="nav-link' + (extraClass ? " " + extraClass(item) : "") + '">' +
        '<span class="nav-icon-wrap">' + icon(item.icon) + badge + "</span><span>" + item.label + "</span></a>";
    }).join("");
  }

  function unreadAvisosCount() {
    return NOTICES.filter(function (n) { return n.status === "publicado" && !n.leidoAlumno; }).length;
  }
  function refreshNavBadges() {
    if (!CURRENT_USER) return;
    renderNavLinks($("#sidebarNav"), navItemsForRole(CURRENT_USER.role));
    renderNavLinks($("#bottomNav"), navItemsForRole(CURRENT_USER.role), function (item) { return item.route === "reservar" ? "nav-cta" : ""; });
    updateNavActive(currentRoute());
  }

  /* ---------------- login / roles ---------------- */
  var CURRENT_USER = null;
  var loginScreen = $("#loginScreen");
  var appShell = $("#appShell");
  var loginForm = $("#loginForm");
  var loginError = $("#loginError");
  var sidebarRoleLabel = $("#sidebarRoleLabel");

  function navItemsForRole(role) { return role === "admin" ? NAV_ITEMS_ADMIN : NAV_ITEMS_ALUMNO; }
  function defaultRouteForRole(role) { return role === "admin" ? "resumen" : "inicio"; }

  function setupNavForRole(role) {
    var items = navItemsForRole(role);
    renderNavLinks($("#sidebarNav"), items);
    renderNavLinks($("#bottomNav"), items, function (item) { return item.route === "reservar" ? "nav-cta" : ""; });
    sidebarRoleLabel.textContent = role === "admin" ? "Acceso club · admin" : "Acceso alumno";
  }

  function enterApp(role) {
    CURRENT_USER = { role: role };
    setupNavForRole(role);
    loginScreen.hidden = true;
    appShell.hidden = false;
    location.hash = "#/" + defaultRouteForRole(role);
    renderRoute();
  }

  function logout() {
    CURRENT_USER = null;
    appShell.hidden = true;
    loginScreen.hidden = false;
    loginForm.reset();
    loginError.hidden = true;
    location.hash = "";
  }

  loginForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var user = $("#li-email", loginForm).value.trim().toLowerCase();
    var pass = $("#li-pass", loginForm).value;
    var account = LOGIN_USERS[user];
    if (account && account.password === pass) {
      loginError.hidden = true;
      enterApp(account.role);
    } else {
      loginError.hidden = false;
    }
  });

  $("#topbarLogout").addEventListener("click", logout);

  $all("[data-fill]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var user = btn.getAttribute("data-fill");
      $("#li-email", loginForm).value = user;
      $("#li-pass", loginForm).value = LOGIN_USERS[user].password;
      loginError.hidden = true;
    });
  });

  /* ---------------- Inicio ---------------- */
  function renderInicio(root) {
    var upcoming = reservations.filter(function (r) { return r.date >= isoDate(todayDate()) && r.status !== "cancelada"; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
    var upcomingHtml = upcoming
      ? '<div class="next-card"><p class="next-card-label">Tu próxima clase</p><p class="next-card-title">' + activityById(upcoming.activityId).name + "</p>" +
        '<p class="next-card-meta">' + formatHuman(upcoming.date) + " · " + upcoming.time + " · " + upcoming.student + "</p></div>"
      : '<div class="next-card"><p class="next-card-label">Aún no tienes clases próximas</p><p class="next-card-title">Reserva tu primera clase de prueba</p></div>';

    var featured = publishedNotices().filter(function (n) { return n.urgent; })[0] || publishedNotices()[0];
    var featuredHtml = featured
      ? '<div class="notice-banner featured-notice"><strong>' + featured.title + "</strong><br>" + featured.message + '<br><a href="#/avisos">Ver todos los avisos</a></div>'
      : "";

    var completedCount = reservations.filter(function (r) { return r.status === "completada"; }).length;
    var firstName = PROFILE.name.split(" ")[0];

    root.appendChild(el(
      '<div>' +
      '<p class="hello">Hola, ' + firstName + '</p>' +
      '<p class="hello-sub">' + CLUB.philosophy + '</p>' +
      upcomingHtml +
      '<button type="button" class="cta-big" id="ctaReservar">' + icon("plus") + "Reservar una clase</button>" +
      '<div class="quick-row">' +
        '<a class="quick-item card" href="#/mis-reservas">' + icon("list") + "<span>Mis reservas</span></a>" +
        '<a class="quick-item card" href="#/actividades">' + icon("grid") + "<span>Actividades</span></a>" +
        '<a class="quick-item card" href="#/avisos">' + icon("bell") + "<span>Avisos</span></a>" +
      "</div>" +
      featuredHtml +
      '<div class="stat-grid" style="margin-bottom:var(--s-5);">' +
        '<div class="card stat-card"><p class="stat-num">' + PROFILE.students.length + '</p><p class="stat-label">Actividades activas</p></div>' +
        '<div class="card stat-card"><p class="stat-num">' + completedCount + '</p><p class="stat-label">Clases asistidas (resumen)</p></div>' +
      "</div>" +
      '<div class="card philosophy-card"><p class="philosophy-quote">"' + CLUB.philosophy + '"</p></div>' +
      '<div class="notice-banner">' + CLUB.notice + "</div>" +
      '<div class="card trial-card">' +
        '<div class="trial-card-copy"><strong>Clase de prueba</strong><span>Tu progreso empieza con una primera clase.</span></div>' +
        '<button type="button" class="btn btn-outline" id="ctaTrial">Reservar clase de prueba</button>' +
      "</div>" +
      "</div>"
    ));
    $("#ctaReservar", root).addEventListener("click", function () { startBooking(null); });
    $("#ctaTrial", root).addEventListener("click", function () { startBooking(null); });
  }

  /* ---------------- Reservar (wizard) ---------------- */
  var pendingActivityId = null;
  var booking = null;
  var WIZ_TITLES = ["Actividad", "Grupo o nivel", "Fecha", "Horario", "Tus datos", "Resumen", "Confirmación"];

  function startBooking(activityId) {
    pendingActivityId = activityId;
    if (currentRoute() === "reservar") { renderRoute(); } else { location.hash = "#/reservar"; }
  }

  function freshBooking(activityId) {
    return {
      step: 1, activityId: activityId || null, group: null, date: null, time: null, days: null,
      nombre: "", edad: "", tutor: "", telefono: "", email: "", nivel: "", observaciones: "", contacto: false,
      calendarMonth: new Date(), reservationId: null
    };
  }

  function renderReservar(root) {
    booking = freshBooking(pendingActivityId);
    pendingActivityId = null;
    root.appendChild(el('<div><div class="wizard-progress" id="wizProgress"></div><p class="wizard-step-label" id="wizStepLabel"></p><div id="wizBody"></div></div>'));
    renderWizardStep(root);
  }

  function renderWizardStep(root) {
    var wizBody = $("#wizBody", root);
    var wizProgress = $("#wizProgress", root);
    var wizStepLabel = $("#wizStepLabel", root);

    wizProgress.innerHTML = [1, 2, 3, 4, 5, 6, 7].map(function (n) {
      return '<span class="wp-seg' + (n <= booking.step ? " is-done" : "") + '"></span>';
    }).join("");
    wizStepLabel.textContent = "Paso " + booking.step + " de 7 · " + WIZ_TITLES[booking.step - 1];

    var bodyHtml = "";
    if (booking.step === 1) bodyHtml = stepActividad();
    else if (booking.step === 2) bodyHtml = stepGrupo();
    else if (booking.step === 3) bodyHtml = stepFecha();
    else if (booking.step === 4) bodyHtml = stepHorario();
    else if (booking.step === 5) bodyHtml = stepDatos();
    else if (booking.step === 6) bodyHtml = stepResumen();
    else bodyHtml = stepConfirmacion();

    wizBody.innerHTML = bodyHtml;
    wireWizardStep(root);
  }

  function stepActividad() {
    return '<div class="choice-list">' + ACTIVITIES.map(function (a) {
      var sel = booking.activityId === a.id;
      return '<button type="button" class="choice-card' + (sel ? " is-selected" : "") + '" data-activity="' + a.id + '">' +
        '<span class="choice-card-main"><strong>' + a.name + "</strong><span>" + a.forWhom + " · " + a.level + "</span></span>" +
        '<span class="choice-card-check">' + icon("check") + "</span></button>";
    }).join("") + "</div>" + wizardNavHtml();
  }

  function stepGrupo() {
    var groups = GROUPS[booking.activityId] || [];
    return '<div class="notice-banner">Grupos de demostración. El club debe validar la organización real de los grupos.</div>' +
      '<div class="choice-list">' + groups.map(function (g) {
        var sel = booking.group === g;
        return '<button type="button" class="choice-card' + (sel ? " is-selected" : "") + '" data-group="' + g + '">' +
          '<span class="choice-card-main"><strong>' + g + "</strong></span>" +
          '<span class="choice-card-check">' + icon("check") + "</span></button>";
      }).join("") + "</div>" + wizardNavHtml();
  }

  function stepFecha() {
    var m = booking.calendarMonth;
    var year = m.getFullYear(), month = m.getMonth();
    var monthLabel = m.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    var classDays = SCHEDULE.filter(function (s) { return s.activityId === booking.activityId; }).reduce(function (acc, s) { return acc.concat(s.days); }, []);
    var first = new Date(year, month, 1);
    var startOffset = dowIndex(first);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = isoDate(todayDate());

    var cells = "";
    for (var i = 0; i < startOffset; i++) cells += '<span class="mc-day is-muted"></span>';
    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(year, month, day);
      var iso = isoDate(d);
      var hasClass = classDays.indexOf(DOW[dowIndex(d)]) !== -1;
      var isPast = iso < today;
      if (isPast) { cells += '<span class="mc-day is-muted">' + day + "</span>"; continue; }
      var cls = "mc-day" + (hasClass ? " has-class" : "") + (iso === today ? " is-today" : "") + (iso === booking.date ? " is-selected" : "");
      cells += '<button type="button" class="' + cls + '" data-date="' + iso + '">' + day + "</button>";
    }

    return '<div class="mini-calendar">' +
      '<div class="mc-head"><div class="mc-nav"><button type="button" id="mcPrev">' + icon("chevronLeft") + '</button><button type="button" id="mcNext">' + icon("chevronRight") + "</button></div>" +
      "<strong>" + monthLabel + '</strong><button type="button" class="mc-today-btn" id="mcToday">Hoy</button></div>' +
      '<div class="mc-grid">' + DOW.slice(0, 7).map(function (d) { return '<span class="mc-dow">' + d.slice(0, 2) + "</span>"; }).join("") + cells + "</div>" +
      "</div>" +
      (classDays.length ? "" : '<div class="notice-banner">No hay días de ejemplo marcados para esta actividad; elige cualquier fecha orientativa.</div>') +
      wizardNavHtml();
  }

  function stepHorario() {
    var slots = SCHEDULE.filter(function (s) { return s.activityId === booking.activityId; });
    return '<div class="notice-banner">Ejemplo de disponibilidad · horario orientativo · confirmar con el club.</div>' +
      '<div class="slot-list">' + slots.map(function (s, idx) {
        var sel = booking.time === s.time;
        return '<button type="button" class="slot-card' + (sel ? " is-selected" : "") + '" data-time="' + s.time + '" data-days="' + s.days.join(",") + '">' +
          '<span><span class="slot-time">' + s.time + "</span><span class=\"slot-days\"> · " + s.days.join(", ") + "</span></span>" +
          '<span class="choice-card-check">' + icon("check") + "</span></button>";
      }).join("") + "</div>" + wizardNavHtml();
  }

  function stepDatos() {
    return '<form id="wizForm" novalidate><div class="field"><label for="f-nombre">Nombre y apellidos del alumno</label><input id="f-nombre" required value="' + booking.nombre + '"></div>' +
      '<div class="field"><label for="f-edad">Edad del alumno</label><input id="f-edad" type="number" min="3" max="99" required value="' + booking.edad + '"></div>' +
      '<div class="field"><label for="f-tutor">Nombre del tutor (si corresponde)</label><input id="f-tutor" value="' + booking.tutor + '"></div>' +
      '<div class="field"><label for="f-telefono">Teléfono</label><input id="f-telefono" type="tel" required value="' + booking.telefono + '"></div>' +
      '<div class="field"><label for="f-email">Email</label><input id="f-email" type="email" required value="' + booking.email + '"></div>' +
      '<div class="field"><label for="f-nivel">Nivel o experiencia</label><select id="f-nivel"><option value="">Sin experiencia previa</option><option value="iniciacion">Iniciación</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></div>' +
      '<div class="field"><label for="f-obs">Observaciones</label><textarea id="f-obs" rows="3">' + booking.observaciones + "</textarea></div>" +
      '<label class="field-check"><input type="checkbox" id="f-contacto" required' + (booking.contacto ? " checked" : "") + "> Acepto que el club se ponga en contacto conmigo para confirmar esta solicitud.</label>" +
      "</form>" + wizardNavHtml();
  }

  function stepResumen() {
    var a = activityById(booking.activityId);
    return '<dl class="summary-list">' +
      "<dt>Actividad</dt><dd>" + a.name + "</dd>" +
      "<dt>Grupo</dt><dd>" + booking.group + "</dd>" +
      "<dt>Fecha</dt><dd>" + formatHuman(booking.date) + "</dd>" +
      "<dt>Horario</dt><dd>" + booking.time + "</dd>" +
      "<dt>Alumno</dt><dd>" + booking.nombre + "</dd>" +
      "<dt>Duración orientativa</dt><dd>" + a.duration + "</dd>" +
      "</dl>" +
      '<div class="notice-banner">Esta es una demostración. La solicitud no se envía realmente.</div>' +
      wizardNavHtml(true);
  }

  function stepConfirmacion() {
    var a = activityById(booking.activityId);
    return '<div class="confirm-screen"><div class="confirm-icon">' + icon("check") + "</div>" +
      "<h2>Solicitud registrada</h2>" +
      '<p class="confirm-num">Número de reserva (ficticio): <strong>' + booking.reservationId + "</strong></p>" +
      '<div class="card card-pad" style="text-align:left;margin-bottom:16px;">' +
        '<p><strong>' + a.name + "</strong> · " + booking.group + "</p>" +
        "<p>" + formatHuman(booking.date) + " · " + booking.time + "</p>" +
      "</div>" +
      "<p>Solicitud de clase de prueba registrada en la demo. En el sistema real, el club recibiría el aviso automáticamente y la familia recibiría la confirmación con las instrucciones necesarias.</p>" +
      '<div class="confirm-actions">' +
        '<button type="button" class="btn btn-outline" id="btnAddCal">Añadir al calendario</button>' +
        '<button type="button" class="btn btn-primary" id="btnBackHome">Volver al inicio</button>' +
      "</div></div>";
  }

  function wizardNavHtml(isLastStep) {
    return '<div class="wizard-nav">' +
      (booking.step > 1 ? '<button type="button" class="btn btn-ghost" id="wizBack">Atrás</button>' : "") +
      '<button type="button" class="btn btn-primary" id="wizNext">' + (isLastStep ? "Confirmar solicitud" : "Continuar") + "</button>" +
      "</div>";
  }

  function wireWizardStep(root) {
    var wizBody = $("#wizBody", root);

    $all("[data-activity]", wizBody).forEach(function (btn) {
      btn.addEventListener("click", function () {
        booking.activityId = btn.getAttribute("data-activity");
        booking.group = null;
        renderWizardStep(root);
      });
    });
    $all("[data-group]", wizBody).forEach(function (btn) {
      btn.addEventListener("click", function () { booking.group = btn.getAttribute("data-group"); renderWizardStep(root); });
    });
    $all("[data-date]", wizBody).forEach(function (btn) {
      btn.addEventListener("click", function () { booking.date = btn.getAttribute("data-date"); renderWizardStep(root); });
    });
    $all("[data-time]", wizBody).forEach(function (btn) {
      btn.addEventListener("click", function () { booking.time = btn.getAttribute("data-time"); booking.days = btn.getAttribute("data-days").split(","); renderWizardStep(root); });
    });
    var mcPrev = $("#mcPrev", wizBody), mcNext = $("#mcNext", wizBody), mcToday = $("#mcToday", wizBody);
    if (mcPrev) mcPrev.addEventListener("click", function () { booking.calendarMonth = new Date(booking.calendarMonth.getFullYear(), booking.calendarMonth.getMonth() - 1, 1); renderWizardStep(root); });
    if (mcNext) mcNext.addEventListener("click", function () { booking.calendarMonth = new Date(booking.calendarMonth.getFullYear(), booking.calendarMonth.getMonth() + 1, 1); renderWizardStep(root); });
    if (mcToday) mcToday.addEventListener("click", function () { booking.calendarMonth = new Date(); renderWizardStep(root); });

    var form = $("#wizForm", wizBody);
    if (form) {
      ["nombre", "edad", "tutor", "telefono", "email", "obs"].forEach(function (key) {
        var input = $("#f-" + key, form);
        if (input) input.addEventListener("input", function () { booking[key === "obs" ? "observaciones" : key] = input.value; });
      });
      var nivelSel = $("#f-nivel", form);
      if (nivelSel) nivelSel.addEventListener("change", function () { booking.nivel = nivelSel.value; });
      var contactoChk = $("#f-contacto", form);
      if (contactoChk) contactoChk.addEventListener("change", function () { booking.contacto = contactoChk.checked; });
    }

    var backBtn = $("#wizBack", wizBody);
    if (backBtn) backBtn.addEventListener("click", function () { booking.step--; renderWizardStep(root); });
    var nextBtn = $("#wizNext", wizBody);
    if (nextBtn) nextBtn.addEventListener("click", function () { advanceWizard(root); });

    var addCalBtn = $("#btnAddCal", wizBody);
    if (addCalBtn) addCalBtn.addEventListener("click", function () { toast("Añadido al calendario (simulado)"); });
    var backHomeBtn = $("#btnBackHome", wizBody);
    if (backHomeBtn) backHomeBtn.addEventListener("click", function () { location.hash = "#/inicio"; });
  }

  function advanceWizard(root) {
    var step = booking.step;
    if (step === 1 && !booking.activityId) { toast("Elige una actividad para continuar"); return; }
    if (step === 2 && !booking.group) { toast("Elige un grupo para continuar"); return; }
    if (step === 3 && !booking.date) { toast("Elige una fecha para continuar"); return; }
    if (step === 4 && !booking.time) { toast("Elige un horario para continuar"); return; }
    if (step === 5) {
      var form = $("#wizForm", root);
      if (!form.checkValidity()) { form.reportValidity(); return; }
    }
    if (step === 6) {
      booking.reservationId = genReservationId();
      reservations.unshift({ id: booking.reservationId, activityId: booking.activityId, group: booking.group, date: booking.date, time: booking.time, student: booking.nombre, status: "pendiente" });
      toast("Reserva simulada correctamente");
    }
    booking.step++;
    renderWizardStep(root);
  }

  /* ---------------- Mis reservas ---------------- */
  var reservations = MY_RESERVATIONS.map(function (r) { return Object.assign({}, r); });

  function renderMisReservas(root) {
    var today = isoDate(todayDate());
    var upcoming = reservations.filter(function (r) { return r.date >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var past = reservations.filter(function (r) { return r.date < today; }).sort(function (a, b) { return a.date > b.date ? -1 : 1; });

    function card(r) {
      var a = activityById(r.activityId);
      var canAct = r.status === "pendiente" || r.status === "confirmada";
      return '<div class="card res-card" data-id="' + r.id + '">' +
        '<div class="res-top"><div><p class="res-title">' + a.name + "</p><p class=\"res-meta\">" + r.group + " · " + formatHuman(r.date) + " · " + r.time + " · " + r.student + '</p></div>' +
        '<span class="status-pill status-' + r.status + '">' + r.status + "</span></div>" +
        (canAct ? '<div class="res-actions"><button type="button" class="btn btn-sm btn-outline" data-change="' + r.id + '">Solicitar cambio</button><button type="button" class="btn btn-sm btn-danger-outline" data-cancel="' + r.id + '">Cancelar</button></div>' : "") +
        "</div>";
    }

    root.appendChild(el('<div><span class="tag-demo" style="margin-bottom:16px;display:inline-block;">Datos de demostración</span></div>'));
    if (!upcoming.length && !past.length) {
      root.appendChild(el('<div class="empty-state">' + icon("calendar") + "<p>Aún no tienes reservas.</p></div>"));
    } else {
      if (upcoming.length) {
        root.appendChild(el('<p class="res-group-title">Próximas</p>'));
        upcoming.forEach(function (r) { root.appendChild(el(card(r))); });
      } else {
        root.appendChild(el('<div class="empty-state">' + icon("calendar") + "<p>No tienes reservas próximas.</p></div>"));
      }
      if (past.length) {
        root.appendChild(el('<p class="res-group-title">Pasadas</p>'));
        past.forEach(function (r) { root.appendChild(el(card(r))); });
      }
    }
    root.appendChild(el('<button type="button" class="btn btn-primary btn-block" id="btnRebook" style="margin-top:20px;">Reservar otra clase</button>'));

    $all("[data-cancel]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = reservations.filter(function (x) { return x.id === btn.getAttribute("data-cancel"); })[0];
        r.status = "cancelada";
        toast("Reserva cancelada (simulado)");
        root.innerHTML = "";
        renderMisReservas(root);
      });
    });
    $all("[data-change]", root).forEach(function (btn) {
      btn.addEventListener("click", function () { toast("Solicitud de cambio enviada (simulado)"); });
    });
    $("#btnRebook", root).addEventListener("click", function () { startBooking(null); });
  }

  /* ---------------- Actividades ---------------- */
  function renderActividades(root) {
    var state = { q: "", tipo: "todas", nivel: "todos" };

    function list() {
      return ACTIVITIES.filter(function (a) {
        var matchQ = a.name.toLowerCase().indexOf(state.q.toLowerCase()) !== -1;
        var matchTipo = state.tipo === "todas" || a.tipo === state.tipo;
        var matchNivel = state.nivel === "todos" || a.level === state.nivel;
        return matchQ && matchTipo && matchNivel;
      });
    }

    function draw() {
      var grid = $("#actGrid", root);
      var items = list();
      grid.innerHTML = items.length ? items.map(function (a) {
        return '<div class="card activity-card">' +
          "<h3>" + a.name + "</h3>" +
          '<p class="activity-meta">' + a.forWhom + "</p>" +
          '<p class="activity-what">' + a.what + "</p>" +
          '<div class="activity-tags"><span class="chip">' + a.level + '</span><span class="chip">' + a.ageRange + '</span><span class="chip chip-avail">' + a.availability + "</span></div>" +
          '<div class="activity-actions">' +
            '<button type="button" class="btn btn-sm btn-outline" data-sched="' + a.id + '">Ver horarios</button>' +
            '<button type="button" class="btn btn-sm btn-primary" data-book="' + a.id + '">Reservar</button>' +
          "</div></div>";
      }).join("") : '<div class="empty-state">' + icon("grid") + "<p>No hay actividades que coincidan con la búsqueda.</p></div>";

      $all("[data-book]", grid).forEach(function (btn) { btn.addEventListener("click", function () { startBooking(btn.getAttribute("data-book")); }); });
      $all("[data-sched]", grid).forEach(function (btn) { btn.addEventListener("click", function () { scheduleFilterPreset = btn.getAttribute("data-sched"); location.hash = "#/horarios"; }); });
    }

    root.appendChild(el(
      '<div><div class="toolbar">' +
        '<input type="search" class="field-input search-input" placeholder="Buscar actividad..." id="actSearch">' +
        '<select class="filter-select" id="actTipo"><option value="todas">Todas las categorías</option><option value="judo">Judo</option><option value="complementaria">Complementarias</option></select>' +
        '<select class="filter-select" id="actNivel"><option value="todos">Todos los niveles</option><option value="Iniciación">Iniciación</option><option value="Intermedio">Intermedio</option><option value="Avanzado">Avanzado</option><option value="Todos los niveles">Todos los niveles</option></select>' +
        '<a href="#/horarios" class="btn btn-outline btn-sm">' + icon("calendar") + "Ver horarios</a>" +
      "</div><div class=\"activity-grid\" id=\"actGrid\"></div></div>"
    ));
    $("#actSearch", root).addEventListener("input", function (e) { state.q = e.target.value; draw(); });
    $("#actTipo", root).addEventListener("change", function (e) { state.tipo = e.target.value; draw(); });
    $("#actNivel", root).addEventListener("change", function (e) { state.nivel = e.target.value; draw(); });
    draw();
  }

  /* ---------------- Horarios ---------------- */
  var scheduleFilterPreset = null;
  var scheduleUI = { mode: "semana", filter: "todas", weekBase: new Date(), monthBase: new Date(), detail: null };

  function renderHorarios(root) {
    if (scheduleFilterPreset) { scheduleUI.filter = scheduleFilterPreset; scheduleFilterPreset = null; }

    if (scheduleUI.detail) {
      setBackHandler(function () { scheduleUI.detail = null; renderHorarios(root); });
      root.innerHTML = "";
      root.appendChild(el(scheduleDetailHtml(scheduleUI.detail)));
      wireScheduleDetail(root);
      return;
    }
    clearBackHandler();

    var filterOptions = '<option value="todas">Todas las actividades</option>' + ACTIVITIES.map(function (a) { return '<option value="' + a.id + '"' + (scheduleUI.filter === a.id ? " selected" : "") + ">" + a.name + "</option>"; }).join("");

    root.innerHTML = "";
    root.appendChild(el(
      '<div><div class="notice-banner">Horarios de demostración. La programación real debe ser validada por el club.</div>' +
      '<div class="toolbar"><div class="view-toggle"><button type="button" id="modeWeek" class="' + (scheduleUI.mode === "semana" ? "is-active" : "") + '">Semana</button><button type="button" id="modeMonth" class="' + (scheduleUI.mode === "mes" ? "is-active" : "") + '">Mes</button></div>' +
      '<select class="filter-select" id="schedFilter">' + filterOptions + "</select></div>" +
      '<div id="schedBody"></div></div>'
    ));

    $("#modeWeek", root).addEventListener("click", function () { scheduleUI.mode = "semana"; renderHorarios(root); });
    $("#modeMonth", root).addEventListener("click", function () { scheduleUI.mode = "mes"; renderHorarios(root); });
    $("#schedFilter", root).addEventListener("change", function (e) { scheduleUI.filter = e.target.value; renderHorarios(root); });

    var schedBody = $("#schedBody", root);
    if (scheduleUI.mode === "semana") schedBody.appendChild(el(weekViewHtml()));
    else schedBody.appendChild(el(monthViewHtml()));
    wireScheduleBody(root);
  }

  function filteredSchedule() {
    return scheduleUI.filter === "todas" ? SCHEDULE : SCHEDULE.filter(function (s) { return s.activityId === scheduleUI.filter; });
  }

  function weekViewHtml() {
    var base = scheduleUI.weekBase;
    var monday = new Date(base);
    monday.setDate(base.getDate() - dowIndex(base));
    var sched = filteredSchedule();
    var days = "";
    for (var i = 0; i < 7; i++) {
      var d = new Date(monday); d.setDate(monday.getDate() + i);
      var dayName = DOW[i];
      var classes = sched.filter(function (s) { return s.days.indexOf(dayName) !== -1; });
      days += '<div class="card week-day"><p class="week-day-name">' + dayName + " " + d.getDate() + "</p>" +
        (classes.length ? classes.map(function (s) {
          var a = activityById(s.activityId);
          return '<button type="button" class="week-class" data-activity="' + s.activityId + '" data-day="' + dayName + '" data-time="' + s.time + '"><strong>' + a.name + "</strong>" + s.time + "</button>";
        }).join("") : '<p class="week-empty">Sin clases</p>') + "</div>";
    }
    return '<div class="week-grid">' + days + "</div>";
  }

  function monthViewHtml() {
    var m = scheduleUI.monthBase;
    var year = m.getFullYear(), month = m.getMonth();
    var monthLabel = m.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    var sched = filteredSchedule();
    var first = new Date(year, month, 1);
    var startOffset = dowIndex(first);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = isoDate(todayDate());
    var cells = "";
    for (var i = 0; i < startOffset; i++) cells += '<span class="mc-day is-muted"></span>';
    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(year, month, day);
      var iso = isoDate(d);
      var dayName = DOW[dowIndex(d)];
      var hasClass = sched.some(function (s) { return s.days.indexOf(dayName) !== -1; });
      cells += '<button type="button" class="mc-day' + (hasClass ? " has-class" : "") + (iso === today ? " is-today" : "") + '" data-daycell="' + dayName + '"' + (hasClass ? "" : " disabled") + ">" + day + "</button>";
    }
    return '<div class="mini-calendar">' +
      '<div class="mc-head"><div class="mc-nav"><button type="button" id="mMcPrev">' + icon("chevronLeft") + '</button><button type="button" id="mMcNext">' + icon("chevronRight") + "</button></div>" +
      "<strong>" + monthLabel + '</strong><button type="button" class="mc-today-btn" id="mMcToday">Hoy</button></div>' +
      '<div class="mc-grid">' + DOW.map(function (d) { return '<span class="mc-dow">' + d.slice(0, 2) + "</span>"; }).join("") + cells + "</div></div>";
  }

  function scheduleDetailHtml(detail) {
    var a = activityById(detail.activityId);
    return '<div class="card detail-card"><p class="detail-title">' + a.name + "</p>" +
      '<div class="detail-list"><span><strong>Día:</strong> ' + detail.day + "</span><span><strong>Horario:</strong> " + detail.time + " (orientativo)</span>" +
      "<span><strong>Para quién:</strong> " + a.forWhom + "</span><span><strong>Nivel:</strong> " + a.level + "</span></div>" +
      '<button type="button" class="btn btn-primary btn-block" id="detailReservar">Reservar esta clase</button></div>';
  }

  function wireScheduleDetail(root) {
    $("#detailReservar", root).addEventListener("click", function () { startBooking(scheduleUI.detail.activityId); });
  }

  function wireScheduleBody(root) {
    $all("[data-activity][data-day]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        scheduleUI.detail = { activityId: btn.getAttribute("data-activity"), day: btn.getAttribute("data-day"), time: btn.getAttribute("data-time") };
        renderHorarios(root);
      });
    });
    $all("[data-daycell]", root).forEach(function (btn) {
      if (btn.disabled) return;
      btn.addEventListener("click", function () {
        var dayName = btn.getAttribute("data-daycell");
        var match = filteredSchedule().filter(function (s) { return s.days.indexOf(dayName) !== -1; })[0];
        if (match) { scheduleUI.detail = { activityId: match.activityId, day: dayName, time: match.time }; renderHorarios(root); }
      });
    });
    var mPrev = $("#mMcPrev", root), mNext = $("#mMcNext", root), mToday = $("#mMcToday", root);
    if (mPrev) mPrev.addEventListener("click", function () { scheduleUI.monthBase = new Date(scheduleUI.monthBase.getFullYear(), scheduleUI.monthBase.getMonth() - 1, 1); renderHorarios(root); });
    if (mNext) mNext.addEventListener("click", function () { scheduleUI.monthBase = new Date(scheduleUI.monthBase.getFullYear(), scheduleUI.monthBase.getMonth() + 1, 1); renderHorarios(root); });
    if (mToday) mToday.addEventListener("click", function () { scheduleUI.monthBase = new Date(); renderHorarios(root); });
  }

  /* ---------------- Perfil ---------------- */
  var BELT_COLOR = { azul: "var(--belt-blue)", amarillo: "var(--belt-yellow)", naranja: "var(--belt-orange)", verde: "var(--belt-green)", marrón: "var(--belt-brown)", negro: "var(--belt-black)", blanco: "var(--belt-white)" };
  function beltColor(str) {
    var key = Object.keys(BELT_COLOR).filter(function (k) { return str.toLowerCase().indexOf(k) !== -1; })[0];
    return BELT_COLOR[key] || "var(--belt-white)";
  }

  function renderPerfil(root) {
    root.innerHTML = "";
    root.appendChild(el(
      '<div class="card profile-head"><span class="avatar">' + PROFILE.initials + "</span>" +
      '<div><p class="profile-name">' + PROFILE.name + "</p><p class=\"profile-sub\">" + (PROFILE.isFamily ? "Cuenta familiar" : "Cuenta individual") + " · Datos precargados de demostración</p></div>" +
      "<button type=\"button\" class=\"btn btn-outline\" id=\"btnEditProfile\" style=\"margin-inline-start:auto;\">Editar perfil</button></div>"
    ));

    root.appendChild(el('<p class="section-title">Alumnos asociados</p>'));
    root.appendChild(el('<div class="card card-pad" id="studentsCard">' + PROFILE.students.map(function (s) {
      return '<div class="student-row"><div><strong>' + s.name + "</strong><br><span style=\"color:var(--muted);font-size:0.84rem;\">" + s.activity + "</span></div>" +
        '<span class="belt-chip" style="background:' + beltColor(s.belt) + ';color:' + (s.belt.toLowerCase().indexOf("blanco") !== -1 ? "#111" : "#fff") + ';">' + s.belt + "</span></div>";
    }).join("") + "</div>"));

    root.appendChild(el('<p class="section-title" style="margin-top:24px;">Historial de reservas</p>'));
    var pastCount = reservations.filter(function (r) { return r.date < isoDate(todayDate()); }).length;
    root.appendChild(el('<div class="card card-pad"><p style="color:var(--muted);font-size:0.9rem;">' + pastCount + " reserva(s) pasada(s) · ver detalle en " + '<a href="#/mis-reservas">Mis reservas</a></p></div>'));

    root.appendChild(el('<p class="section-title" style="margin-top:24px;">Contacto y preferencias</p>'));
    root.appendChild(el('<div class="card card-pad" id="contactCard"><dl>' +
      '<div class="info-row"><dt>Teléfono</dt><dd>' + PROFILE.phone + "</dd></div>" +
      '<div class="info-row"><dt>Email</dt><dd>' + PROFILE.email + "</dd></div>" +
      '<div class="info-row"><dt>Comunicación</dt><dd>' + PROFILE.commsPrefs.join(", ") + "</dd></div>" +
      "</dl></div>"));

    $("#btnEditProfile", root).addEventListener("click", function () {
      openModal("Editar perfil",
        '<form id="editProfileForm" novalidate>' +
        '<div class="field"><label for="ep-nombre">Nombre</label><input id="ep-nombre" value="' + PROFILE.name + '" required></div>' +
        '<div class="field"><label for="ep-telefono">Teléfono</label><input id="ep-telefono" value="' + PROFILE.phone + '" required></div>' +
        '<div class="field"><label for="ep-email">Email</label><input id="ep-email" type="email" value="' + PROFILE.email + '" required></div>' +
        '<button type="submit" class="btn btn-primary btn-block">Guardar cambios</button>' +
        '<p style="font-size:0.76rem;color:var(--muted);margin-top:10px;text-align:center;">Cambios simulados: no se guardan en un servidor real.</p>' +
        "</form>"
      );
      $("#editProfileForm").addEventListener("submit", function (ev) {
        ev.preventDefault();
        PROFILE.name = $("#ep-nombre").value;
        PROFILE.phone = $("#ep-telefono").value;
        PROFILE.email = $("#ep-email").value;
        PROFILE.initials = PROFILE.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
        closeModal();
        toast("Perfil actualizado (simulado)");
        renderPerfil(root);
      });
    });
  }

  /* ---------------- Avisos (alumno) ---------------- */
  var CATEGORY_LABEL = { general: "General", horarios: "Horarios", "competición": "Competición", pagos: "Pagos", actividades: "Actividades" };
  var avisosAlumnoFilter = { tab: "no-leidos", cat: "todas" };

  function publishedNotices() { return NOTICES.filter(function (n) { return n.status === "publicado"; }); }

  function renderAvisosAlumno(root) {
    var f = avisosAlumnoFilter;
    function list() {
      return publishedNotices().filter(function (n) {
        var matchTab = f.tab === "todos" || (f.tab === "no-leidos" ? !n.leidoAlumno : n.leidoAlumno);
        var matchCat = f.cat === "todas" || n.category === f.cat;
        return matchTab && matchCat;
      }).sort(function (a, b) { return a.publishDate < b.publishDate ? 1 : -1; });
    }
    function noticeCard(n) {
      return '<div class="card notice-card' + (n.leidoAlumno ? "" : " is-unread") + '">' +
        '<div class="notice-card-head"><span class="chip">' + CATEGORY_LABEL[n.category] + "</span>" +
        (n.urgent ? '<span class="chip chip-urgent">Urgente</span>' : "") +
        '<span class="notice-date">' + formatHuman(n.publishDate) + "</span></div>" +
        "<h3>" + n.title + "</h3><p class=\"notice-msg\">" + n.message + "</p>" +
        (n.leidoAlumno ? "" : '<button type="button" class="btn btn-sm btn-outline" data-read="' + n.id + '">Marcar como leído</button>') +
        "</div>";
    }
    function draw() {
      var body = $("#avisosBody", root);
      var items = list();
      body.innerHTML = items.length ? items.map(noticeCard).join("") : '<div class="empty-state">' + icon("bell") + "<p>No hay avisos en esta vista.</p></div>";
      $all("[data-read]", body).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var n = NOTICES.filter(function (x) { return x.id === btn.getAttribute("data-read"); })[0];
          n.leidoAlumno = true;
          refreshNavBadges();
          draw();
        });
      });
    }
    root.innerHTML = '<div class="toolbar">' +
      '<div class="view-toggle"><button type="button" data-tab="no-leidos">No leídos</button><button type="button" data-tab="leidos">Leídos</button><button type="button" data-tab="todos">Todos</button></div>' +
      '<select class="filter-select" id="avisosCat"><option value="todas">Todas las categorías</option>' +
      Object.keys(CATEGORY_LABEL).map(function (k) { return '<option value="' + k + '">' + CATEGORY_LABEL[k] + "</option>"; }).join("") +
      "</select></div><div id=\"avisosBody\"></div>";
    $all("[data-tab]", root).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === f.tab);
      btn.addEventListener("click", function () { f.tab = btn.getAttribute("data-tab"); renderAvisosAlumno(root); });
    });
    $("#avisosCat", root).value = f.cat;
    $("#avisosCat", root).addEventListener("change", function (e) { f.cat = e.target.value; draw(); });
    draw();
  }

  /* ---------------- Panel de administrador: shared helpers ---------------- */
  var automations = AUTOMATIONS.map(function (a) { return Object.assign({}, a); });

  function simulatedAction(label) {
    toast("Acción simulada: " + label + ". En la versión real se conectaría con el CRM y los canales de comunicación del club.");
  }
  function adminBadge() { return '<span class="panel-badge">Panel de administrador · Demo · Datos ficticios</span>'; }
  function genId(prefix) { return prefix + "-" + Math.random().toString(36).slice(2, 7).toUpperCase(); }
  function studentById(id) { return STUDENTS.filter(function (s) { return s.id === id; })[0]; }
  function groupOptionsHtml(activityId, selected) {
    return (GROUPS[activityId] || []).map(function (g) { return '<option value="' + g + '"' + (g === selected ? " selected" : "") + ">" + g + "</option>"; }).join("");
  }

  /* ---------------- Resumen ---------------- */
  function renderResumen(root) {
    var today = isoDate(todayDate());
    var reservasHoy = ADMIN_RESERVATIONS.filter(function (r) { return r.date === today; }).length;
    var solicitudesNuevas = ADMIN_RESERVATIONS.filter(function (r) { return r.status === "pendiente"; }).length;
    var pruebasPendientes = ADMIN_RESERVATIONS.filter(function (r) { return r.trial && r.status === "pendiente"; }).length;
    var alumnosActivos = STUDENTS.filter(function (s) { return s.estado === "activo"; }).length;
    var occAvg = Math.round(ADMIN_CLASSES.reduce(function (sum, c) { return sum + (c.occupied / c.capacity); }, 0) / ADMIN_CLASSES.length * 100);
    var avisosActivos = NOTICES.filter(function (n) { return n.status === "publicado"; }).length;
    var seguimiento = STUDENTS.filter(function (s) { return s.seguimiento; }).length;
    var noAsistio = ADMIN_RESERVATIONS.filter(function (r) { return r.status === "no-asistio"; }).length;

    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el('<div class="stat-grid">' +
      '<div class="card stat-card"><p class="stat-num">' + reservasHoy + '</p><p class="stat-label">Reservas de hoy</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + solicitudesNuevas + '</p><p class="stat-label">Solicitudes nuevas</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + pruebasPendientes + '</p><p class="stat-label">Clases de prueba pendientes</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + alumnosActivos + '</p><p class="stat-label">Alumnos activos</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + occAvg + '%</p><p class="stat-label">Ocupación media simulada</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + avisosActivos + '</p><p class="stat-label">Avisos activos</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + seguimiento + '</p><p class="stat-label">Alumnos pendientes de seguimiento</p></div>' +
      '<div class="card stat-card"><p class="stat-num">' + noAsistio + "</p><p class=\"stat-label\">Alertas de no asistencia</p></div>" +
      "</div>"));

    root.appendChild(el('<p class="section-title">Acciones rápidas</p>'));
    root.appendChild(el('<div class="quick-actions-grid">' + ADMIN_QUICK_ACTIONS.map(function (a) {
      return '<button type="button" class="card quick-action-btn" data-goto="' + a.route + '">' + a.label + "</button>";
    }).join("") + "</div>"));
    $all("[data-goto]", root).forEach(function (btn) { btn.addEventListener("click", function () { location.hash = "#/" + btn.getAttribute("data-goto"); }); });

    root.appendChild(el('<p class="section-title" style="margin-top:28px;">Actividad reciente</p>'));
    root.appendChild(el('<div class="card">' + ADMIN_ACTIVITY_FEED.map(function (f) {
      return '<div class="panel-row"><div class="panel-row-main"><strong>' + f.text + '</strong><span>' + f.time + "</span></div></div>";
    }).join("") + "</div>"));
  }

  /* ---------------- Admin: Reservas ---------------- */
  var adminReservasFilter = { estado: "todas", actividad: "todas", q: "" };

  function reservaStatusLabel(s) {
    return { pendiente: "Pendiente", confirmada: "Confirmada", cancelada: "Cancelada", completada: "Completada", "no-asistio": "No asistió" }[s] || s;
  }

  function renderAdminReservas(root) {
    var f = adminReservasFilter;
    function list() {
      return ADMIN_RESERVATIONS.filter(function (r) {
        var matchEstado = f.estado === "todas" || r.status === f.estado;
        var matchAct = f.actividad === "todas" || r.activityId === f.actividad;
        var matchQ = !f.q || r.student.toLowerCase().indexOf(f.q.toLowerCase()) !== -1;
        return matchEstado && matchAct && matchQ;
      }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    }
    function rowActions(r) {
      var btns = [];
      if (r.status === "pendiente") {
        btns.push('<button type="button" class="btn btn-sm btn-primary" data-confirm="' + r.id + '">Confirmar</button>');
        btns.push('<button type="button" class="btn btn-sm btn-danger-outline" data-cancel="' + r.id + '">Cancelar</button>');
      }
      if (r.status === "confirmada") {
        btns.push('<button type="button" class="btn btn-sm btn-primary" data-attend="' + r.id + '">Marcar asistencia</button>');
        btns.push('<button type="button" class="btn btn-sm btn-outline" data-noshow="' + r.id + '">Registrar no asistencia</button>');
        btns.push('<button type="button" class="btn btn-sm btn-danger-outline" data-cancel="' + r.id + '">Cancelar</button>');
      }
      btns.push('<button type="button" class="btn btn-sm btn-outline" data-changegroup="' + r.id + '">Cambiar grupo</button>');
      btns.push('<button type="button" class="btn btn-sm btn-ghost" data-contact="' + r.id + '">Contactar alumno</button>');
      return btns.join("");
    }
    function draw() {
      var body = $("#resBody", root);
      var items = list();
      body.innerHTML = items.length ? '<div class="admin-table">' + items.map(function (r) {
        var a = activityById(r.activityId);
        return '<div class="admin-row">' +
          '<div class="admin-row-main"><strong>' + a.name + " · " + r.group + "</strong>" +
          '<span>' + formatHuman(r.date) + " · " + r.time + " · " + r.student + (r.trial ? " · <em>clase de prueba</em>" : "") + "</span></div>" +
          '<span class="status-pill status-' + r.status + '">' + reservaStatusLabel(r.status) + "</span>" +
          '<div class="admin-row-actions">' + rowActions(r) + "</div></div>";
      }).join("") + "</div>" : '<div class="empty-state">' + icon("list") + "<p>No hay reservas que coincidan con los filtros.</p></div>";

      $all("[data-confirm]", body).forEach(function (btn) { btn.addEventListener("click", function () { setResStatus(btn.getAttribute("data-confirm"), "confirmada"); toast("Reserva confirmada en la demo."); draw(); }); });
      $all("[data-cancel]", body).forEach(function (btn) { btn.addEventListener("click", function () { setResStatus(btn.getAttribute("data-cancel"), "cancelada"); toast("Reserva cancelada en la demo."); draw(); }); });
      $all("[data-attend]", body).forEach(function (btn) { btn.addEventListener("click", function () { setResStatus(btn.getAttribute("data-attend"), "completada"); toast("Asistencia registrada en la demo."); draw(); }); });
      $all("[data-noshow]", body).forEach(function (btn) { btn.addEventListener("click", function () { setResStatus(btn.getAttribute("data-noshow"), "no-asistio"); toast("No asistencia registrada en la demo. En una versión real, se enviaría un mensaje amable con enlace para elegir otra fecha."); draw(); }); });
      $all("[data-contact]", body).forEach(function (btn) { btn.addEventListener("click", function () { simulatedAction("Contactar alumno"); }); });
      $all("[data-changegroup]", body).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var r = ADMIN_RESERVATIONS.filter(function (x) { return x.id === btn.getAttribute("data-changegroup"); })[0];
          openModal("Cambiar grupo",
            '<form id="changeGroupForm"><div class="field"><label for="cg-group">Nuevo grupo</label><select id="cg-group">' + groupOptionsHtml(r.activityId, r.group) + "</select></div>" +
            '<button type="submit" class="btn btn-primary btn-block">Guardar cambio</button></form>');
          $("#changeGroupForm").addEventListener("submit", function (ev) {
            ev.preventDefault();
            r.group = $("#cg-group").value;
            closeModal();
            toast("Grupo actualizado en la demo.");
            draw();
          });
        });
      });
    }
    function setResStatus(id, status) {
      var r = ADMIN_RESERVATIONS.filter(function (x) { return x.id === id; })[0];
      r.status = status;
    }

    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el(
      '<div>' +
      '<div class="toolbar">' +
      '<input type="search" class="field-input search-input" placeholder="Buscar alumno..." id="resSearch">' +
      '<select class="filter-select" id="resEstado"><option value="todas">Todos los estados</option><option value="pendiente">Pendientes</option><option value="confirmada">Confirmadas</option><option value="completada">Completadas</option><option value="cancelada">Canceladas</option><option value="no-asistio">No asistencias</option></select>' +
      '<select class="filter-select" id="resActividad"><option value="todas">Todas las actividades</option>' + ACTIVITIES.map(function (a) { return '<option value="' + a.id + '">' + a.name + "</option>"; }).join("") + "</select>" +
      "</div><div id=\"resBody\"></div></div>"
    ));
    $("#resSearch", root).addEventListener("input", function (e) { f.q = e.target.value; draw(); });
    $("#resEstado", root).addEventListener("change", function (e) { f.estado = e.target.value; draw(); });
    $("#resActividad", root).addEventListener("change", function (e) { f.actividad = e.target.value; draw(); });
    draw();
  }

  /* ---------------- Admin: Calendario ---------------- */
  var adminCalUI = { mode: "semana", day: DOW[dowIndex(todayDate())] };

  function classesForDay(day) { return ADMIN_CLASSES.filter(function (c) { return c.day === day; }); }

  function classRowHtml(c) {
    var a = activityById(c.activityId);
    return '<div class="admin-row" data-class-row="' + c.id + '">' +
      '<div class="admin-row-main"><strong>' + a.name + " · " + c.group + "</strong>" +
      '<span>' + c.timeStart + "–" + c.timeEnd + " · " + c.occupied + "/" + c.capacity + " plazas · " + c.teacher + " · " + c.location + "</span></div>" +
      '<div class="admin-row-actions">' +
      '<button type="button" class="btn btn-sm btn-outline" data-attend-class="' + c.id + '">Asistencia</button>' +
      '<button type="button" class="btn btn-sm btn-outline" data-edit-class="' + c.id + '">Editar</button>' +
      '<button type="button" class="btn btn-sm btn-danger-outline" data-del-class="' + c.id + '">Eliminar</button>' +
      "</div></div>";
  }

  function classFormFields(c) {
    c = c || {};
    return '<div class="field"><label for="cf-activity">Actividad</label><select id="cf-activity">' +
      ACTIVITIES.map(function (a) { return '<option value="' + a.id + '"' + (a.id === c.activityId ? " selected" : "") + ">" + a.name + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="cf-group">Grupo</label><select id="cf-group">' + groupOptionsHtml(c.activityId || ACTIVITIES[0].id, c.group) + "</select></div>" +
      '<div class="field"><label for="cf-day">Día</label><select id="cf-day">' + DOW.map(function (d) { return '<option value="' + d + '"' + (d === c.day ? " selected" : "") + ">" + d + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="cf-start">Hora de inicio</label><input id="cf-start" type="time" value="' + (c.timeStart || "18:00") + '"></div>' +
      '<div class="field"><label for="cf-end">Hora de fin</label><input id="cf-end" type="time" value="' + (c.timeEnd || "19:00") + '"></div>' +
      '<div class="field"><label for="cf-capacity">Plazas máximas</label><input id="cf-capacity" type="number" min="1" value="' + (c.capacity || 12) + '"></div>' +
      '<div class="field"><label for="cf-location">Ubicación</label><input id="cf-location" value="' + (c.location || "Tatami principal") + '"></div>' +
      '<div class="field"><label for="cf-notes">Notas</label><textarea id="cf-notes" rows="2">' + (c.notes || "") + "</textarea></div>";
  }

  function wireClassFormActivity() {
    var activitySel = $("#cf-activity");
    if (!activitySel) return;
    activitySel.addEventListener("change", function () { $("#cf-group").innerHTML = groupOptionsHtml(activitySel.value); });
  }

  function openCreateClassModal(redraw) {
    openModal("Crear clase", '<form id="classForm">' + classFormFields() + '<button type="submit" class="btn btn-primary btn-block">Crear clase</button></form>');
    wireClassFormActivity();
    $("#classForm").addEventListener("submit", function (ev) {
      ev.preventDefault();
      ADMIN_CLASSES.push({
        id: genId("CLS"), activityId: $("#cf-activity").value, group: $("#cf-group").value, day: $("#cf-day").value,
        timeStart: $("#cf-start").value, timeEnd: $("#cf-end").value, capacity: Number($("#cf-capacity").value) || 12,
        occupied: 0, teacher: "Por asignar (ejemplo)", location: $("#cf-location").value, notes: $("#cf-notes").value
      });
      closeModal();
      toast("Clase creada en la demo. En una versión real, aparecería en el calendario de alumnos y se enviarían los avisos correspondientes.");
      redraw();
    });
  }

  function openEditClassModal(c, redraw) {
    openModal("Editar clase", '<form id="classForm">' + classFormFields(c) + '<button type="submit" class="btn btn-primary btn-block">Guardar cambios</button></form>');
    wireClassFormActivity();
    $("#classForm").addEventListener("submit", function (ev) {
      ev.preventDefault();
      c.activityId = $("#cf-activity").value; c.group = $("#cf-group").value; c.day = $("#cf-day").value;
      c.timeStart = $("#cf-start").value; c.timeEnd = $("#cf-end").value; c.capacity = Number($("#cf-capacity").value) || c.capacity;
      c.location = $("#cf-location").value; c.notes = $("#cf-notes").value;
      closeModal();
      toast("Clase actualizada en la demo.");
      redraw();
    });
  }

  function openAttendanceModal(c) {
    var roster = STUDENTS.filter(function (s) { return s.activityId === c.activityId && s.group === c.group; });
    var a = activityById(c.activityId);
    if (!roster.length) {
      openModal("Registrar asistencia", '<p class="section-lead">' + a.name + " · " + c.group + '</p><div class="empty-state">' + icon("user") + "<p>No hay alumnos de demostración en este grupo.</p></div>");
      return;
    }
    var state = {};
    roster.forEach(function (s) { state[s.id] = { status: "", obs: "" }; });
    openModal("Registrar asistencia",
      '<p class="section-lead">' + a.name + " · " + c.group + " · " + c.timeStart + "–" + c.timeEnd + '</p><div id="attList">' +
      roster.map(function (s) {
        return '<div class="attend-row" data-student="' + s.id + '"><strong>' + s.nombre + '</strong>' +
          '<div class="attend-btns">' +
          '<button type="button" class="chip-btn" data-mark="' + s.id + '" data-mark-status="presente">Presente</button>' +
          '<button type="button" class="chip-btn" data-mark="' + s.id + '" data-mark-status="ausente">Ausente</button>' +
          '<button type="button" class="chip-btn" data-mark="' + s.id + '" data-mark-status="no-justificado">No justificado</button>' +
          "</div><input type=\"text\" class=\"attend-obs\" placeholder=\"Observación (opcional)\" data-obs=\"" + s.id + "\"></div>";
      }).join("") +
      '</div><button type="button" class="btn btn-primary btn-block" id="saveAttendance">Guardar asistencia</button>' +
      '<p style="font-size:0.76rem;color:var(--muted);margin-top:10px;text-align:center;">Registro simulado: se usaría para seguimiento y reactivación.</p>'
    );
    $all("[data-mark]", modalBody).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sid = btn.getAttribute("data-mark");
        state[sid].status = btn.getAttribute("data-mark-status");
        $all('[data-mark="' + sid + '"]', modalBody).forEach(function (b) { b.classList.toggle("is-selected", b === btn); });
      });
    });
    $all("[data-obs]", modalBody).forEach(function (input) {
      input.addEventListener("input", function () { state[input.getAttribute("data-obs")].obs = input.value; });
    });
    $("#saveAttendance", modalBody).addEventListener("click", function () {
      var today = isoDate(todayDate());
      roster.forEach(function (s) {
        var rec = state[s.id];
        if (!rec.status) return;
        s.ultimaAsistencia = today;
        if (rec.status !== "presente") s.seguimiento = true;
        if (rec.obs) s.notas.push(formatHuman(today) + " — " + reservaStatusLabel(rec.status === "ausente" ? "no-asistio" : rec.status) + ": " + rec.obs);
      });
      closeModal();
      toast("Asistencia registrada en la demo. En una versión real, se usaría para seguimiento y reactivación.");
    });
  }

  function renderAdminCalendario(root) {
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el(
      '<div>' +
      '<div class="toolbar">' +
      '<div class="view-toggle"><button type="button" id="calModeDia">Día</button><button type="button" id="calModeSemana">Semana</button><button type="button" id="calModeMes">Mes</button></div>' +
      '<button type="button" class="btn btn-primary btn-sm" id="btnCreateClass">+ Crear clase</button>' +
      "</div><div id=\"calBody\"></div></div>"
    ));
    $("#calModeDia", root).classList.toggle("is-active", adminCalUI.mode === "dia");
    $("#calModeSemana", root).classList.toggle("is-active", adminCalUI.mode === "semana");
    $("#calModeMes", root).classList.toggle("is-active", adminCalUI.mode === "mes");
    $("#calModeDia", root).addEventListener("click", function () { adminCalUI.mode = "dia"; renderAdminCalendario(root); });
    $("#calModeSemana", root).addEventListener("click", function () { adminCalUI.mode = "semana"; renderAdminCalendario(root); });
    $("#calModeMes", root).addEventListener("click", function () { adminCalUI.mode = "mes"; renderAdminCalendario(root); });
    $("#btnCreateClass", root).addEventListener("click", function () { openCreateClassModal(function () { renderAdminCalendario(root); }); });

    var body = $("#calBody", root);
    if (adminCalUI.mode === "dia") {
      body.appendChild(el('<div class="day-select">' + DOW.map(function (d) {
        return '<button type="button" class="chip-btn' + (d === adminCalUI.day ? " is-selected" : "") + '" data-day="' + d + '">' + d + "</button>";
      }).join("") + "</div>"));
      var classes = classesForDay(adminCalUI.day);
      body.appendChild(el(classes.length ? '<div class="admin-table">' + classes.map(classRowHtml).join("") + "</div>" : '<div class="empty-state">' + icon("calendar") + "<p>Sin clases este día.</p></div>"));
      $all("[data-day]", body).forEach(function (btn) { btn.addEventListener("click", function () { adminCalUI.day = btn.getAttribute("data-day"); renderAdminCalendario(root); }); });
    } else if (adminCalUI.mode === "semana") {
      body.appendChild(el('<div class="week-grid">' + DOW.map(function (d) {
        var classes = classesForDay(d);
        return '<div class="card week-day"><p class="week-day-name">' + d + "</p>" +
          (classes.length ? classes.map(function (c) {
            var a = activityById(c.activityId);
            return '<button type="button" class="week-class" data-day="' + d + '" data-class="' + c.id + '"><strong>' + a.name + "</strong>" + c.timeStart + "–" + c.timeEnd + "</button>";
          }).join("") : '<p class="week-empty">Sin clases</p>') + "</div>";
      }).join("") + "</div>"));
      $all("[data-class]", body).forEach(function (btn) {
        btn.addEventListener("click", function () { adminCalUI.day = btn.getAttribute("data-day"); adminCalUI.mode = "dia"; renderAdminCalendario(root); });
      });
    } else {
      var daysWithClass = DOW.filter(function (d) { return classesForDay(d).length; });
      body.appendChild(el('<div class="notice-banner">Vista mensual de ejemplo: los puntos marcan días de la semana con clases programadas.</div>'));
      body.appendChild(el('<div class="day-select">' + DOW.map(function (d) {
        return '<button type="button" class="chip-btn' + (daysWithClass.indexOf(d) !== -1 ? " has-dot" : "") + (d === adminCalUI.day ? " is-selected" : "") + '" data-day="' + d + '">' + d + "</button>";
      }).join("") + "</div>"));
      var mClasses = classesForDay(adminCalUI.day);
      body.appendChild(el(mClasses.length ? '<div class="admin-table">' + mClasses.map(classRowHtml).join("") + "</div>" : '<div class="empty-state">' + icon("calendar") + "<p>Sin clases este día.</p></div>"));
      $all("[data-day]", body).forEach(function (btn) { btn.addEventListener("click", function () { adminCalUI.day = btn.getAttribute("data-day"); renderAdminCalendario(root); }); });
    }

    $all("[data-attend-class]", body).forEach(function (btn) {
      btn.addEventListener("click", function () { openAttendanceModal(ADMIN_CLASSES.filter(function (c) { return c.id === btn.getAttribute("data-attend-class"); })[0]); });
    });
    $all("[data-edit-class]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var c = ADMIN_CLASSES.filter(function (x) { return x.id === btn.getAttribute("data-edit-class"); })[0];
        openEditClassModal(c, function () { renderAdminCalendario(root); });
      });
    });
    $all("[data-del-class]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-del-class");
        ADMIN_CLASSES.splice(ADMIN_CLASSES.findIndex(function (x) { return x.id === id; }), 1);
        toast("Clase eliminada en la demo.");
        renderAdminCalendario(root);
      });
    });
  }

  /* ---------------- Admin: Alumnos + Accesos ---------------- */
  var adminAlumnosUI = { tab: "alumnos", q: "", estado: "todos" };

  function studentFichaHtml(s) {
    var a = activityById(s.activityId);
    var resHist = ADMIN_RESERVATIONS.filter(function (r) { return r.student === s.nombre; });
    var notices = NOTICES.filter(function (n) { return n.status === "publicado" && (n.audience === "Todos" || n.audience.indexOf(s.group) !== -1); });
    return '<div class="ficha-block"><p class="info-row"><dt>Edad</dt><dd>' + s.edad + " años</dd></p>" +
      (s.tutor ? '<p class="info-row"><dt>Tutor</dt><dd>' + s.tutor + "</dd></p>" : "") +
      '<p class="info-row"><dt>Teléfono</dt><dd>' + s.telefono + "</dd></p>" +
      '<p class="info-row"><dt>Email</dt><dd>' + s.email + "</dd></p>" +
      '<p class="info-row"><dt>Actividad</dt><dd>' + a.name + " · " + s.group + "</dd></p>" +
      '<p class="info-row"><dt>Nivel</dt><dd>' + s.nivel + "</dd></p>" +
      '<p class="info-row"><dt>Última asistencia</dt><dd>' + (s.ultimaAsistencia ? formatHuman(s.ultimaAsistencia) : "Sin registro") + "</dd></p></div>" +
      '<p class="section-title" style="margin-top:18px;">Reservas</p>' +
      (resHist.length ? '<div class="card card-pad">' + resHist.map(function (r) { return "<p style=\"font-size:0.86rem;margin-bottom:6px;\">" + formatHuman(r.date) + " · " + activityById(r.activityId).name + " · <span class=\"status-pill status-" + r.status + "\">" + reservaStatusLabel(r.status) + "</span></p>"; }).join("") + "</div>" : '<p class="section-lead">Sin reservas registradas.</p>') +
      '<p class="section-title" style="margin-top:18px;">Avisos enviados</p>' +
      (notices.length ? '<div class="card card-pad">' + notices.map(function (n) { return '<p style="font-size:0.86rem;margin-bottom:6px;">' + n.title + "</p>"; }).join("") + "</div>" : '<p class="section-lead">Sin avisos dirigidos a este grupo.</p>') +
      '<p class="section-title" style="margin-top:18px;">Notas internas</p>' +
      '<div class="card card-pad">' + (s.notas.length ? s.notas.map(function (n) { return '<p style="font-size:0.86rem;margin-bottom:6px;">' + n + "</p>"; }).join("") : '<p class="section-lead" style="margin:0;">Sin notas.</p>') +
      '<form id="addNoteForm" style="margin-top:10px;display:flex;gap:8px;"><input id="newNoteInput" placeholder="Añadir nota interna..." style="flex:1;border:1.5px solid var(--line-strong);border-radius:var(--radius-sm);padding:9px 12px;font-family:inherit;"><button type="submit" class="btn btn-sm btn-outline">Añadir</button></form></div>';
  }

  function openStudentFicha(s, redraw) {
    openModal(s.nombre, studentFichaHtml(s) +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-sm btn-outline" id="fichaEdit">Editar ficha</button>' +
      '<button type="button" class="btn btn-sm btn-outline" id="fichaContact">Contactar familia</button>' +
      '<button type="button" class="btn btn-sm ' + (s.estado === "activo" ? "btn-danger-outline" : "btn-outline") + '" id="fichaToggleEstado">' + (s.estado === "activo" ? "Marcar como inactivo" : "Reactivar alumno") + "</button></div>"
    );
    $("#addNoteForm", modalBody).addEventListener("submit", function (ev) {
      ev.preventDefault();
      var val = $("#newNoteInput", modalBody).value.trim();
      if (!val) return;
      s.notas.push(val);
      closeModal();
      toast("Nota interna añadida (simulado).");
      openStudentFicha(s, redraw);
    });
    $("#fichaContact", modalBody).addEventListener("click", function () { simulatedAction("Contactar familia"); });
    $("#fichaToggleEstado", modalBody).addEventListener("click", function () {
      s.estado = s.estado === "activo" ? "inactivo" : "activo";
      closeModal();
      toast(s.estado === "activo" ? "Alumno reactivado en la demo." : "Alumno marcado como inactivo en la demo.");
      redraw();
    });
    $("#fichaEdit", modalBody).addEventListener("click", function () { closeModal(); openStudentEditModal(s, redraw); });
  }

  function openStudentEditModal(s, redraw) {
    var isNew = !s;
    s = s || { id: genId("AL"), nombre: "", edad: "", tutor: "", telefono: "", email: "", activityId: ACTIVITIES[0].id, group: GROUPS[ACTIVITIES[0].id][0], nivel: "", estado: "activo", ultimaAsistencia: "", seguimiento: false, notas: [] };
    openModal(isNew ? "Añadir alumno" : "Editar ficha",
      '<form id="studentForm">' +
      '<div class="field"><label for="sf-nombre">Nombre y apellidos</label><input id="sf-nombre" required value="' + s.nombre + '"></div>' +
      '<div class="field"><label for="sf-edad">Edad</label><input id="sf-edad" type="number" min="3" required value="' + s.edad + '"></div>' +
      '<div class="field"><label for="sf-tutor">Tutor (si corresponde)</label><input id="sf-tutor" value="' + s.tutor + '"></div>' +
      '<div class="field"><label for="sf-telefono">Teléfono</label><input id="sf-telefono" required value="' + s.telefono + '"></div>' +
      '<div class="field"><label for="sf-email">Email</label><input id="sf-email" type="email" required value="' + s.email + '"></div>' +
      '<div class="field"><label for="sf-activity">Actividad</label><select id="sf-activity">' + ACTIVITIES.map(function (a) { return '<option value="' + a.id + '"' + (a.id === s.activityId ? " selected" : "") + ">" + a.name + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="sf-group">Grupo</label><select id="sf-group">' + groupOptionsHtml(s.activityId, s.group) + "</select></div>" +
      '<div class="field"><label for="sf-nivel">Nivel o cinturón (dato simulado)</label><input id="sf-nivel" value="' + s.nivel + '"></div>' +
      '<button type="submit" class="btn btn-primary btn-block">' + (isNew ? "Añadir alumno" : "Guardar cambios") + "</button></form>"
    );
    $("#sf-activity", modalBody).addEventListener("change", function () { $("#sf-group", modalBody).innerHTML = groupOptionsHtml(this.value); });
    $("#studentForm", modalBody).addEventListener("submit", function (ev) {
      ev.preventDefault();
      s.nombre = $("#sf-nombre", modalBody).value; s.edad = Number($("#sf-edad", modalBody).value);
      s.tutor = $("#sf-tutor", modalBody).value; s.telefono = $("#sf-telefono", modalBody).value; s.email = $("#sf-email", modalBody).value;
      s.activityId = $("#sf-activity", modalBody).value; s.group = $("#sf-group", modalBody).value; s.nivel = $("#sf-nivel", modalBody).value;
      if (isNew) STUDENTS.push(s);
      closeModal();
      toast(isNew ? "Alumno añadido en la demo." : "Ficha actualizada en la demo.");
      redraw();
    });
  }

  function accessStatusLabel(s) { return { activo: "Activo", pendiente: "Pendiente", bloqueado: "Bloqueado" }[s] || s; }

  function openAccessFormModal(redraw) {
    openModal("Crear acceso",
      '<form id="accessForm">' +
      '<div class="field"><label for="af-nombre">Nombre</label><input id="af-nombre" required></div>' +
      '<div class="field"><label for="af-email">Email</label><input id="af-email" type="email" required></div>' +
      '<div class="field"><label for="af-telefono">Teléfono</label><input id="af-telefono" required></div>' +
      '<div class="field"><label for="af-student">Alumno asociado</label><select id="af-student">' + STUDENTS.map(function (s) { return '<option value="' + s.id + '">' + s.nombre + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="af-tipo">Tipo de cuenta</label><select id="af-tipo"><option value="alumno">Alumno</option><option value="tutor">Tutor/familia</option></select></div>' +
      '<div class="field"><label for="af-estado">Estado inicial</label><select id="af-estado"><option value="pendiente">Pendiente</option><option value="activo">Activo</option></select></div>' +
      '<button type="submit" class="btn btn-primary btn-block">Crear acceso</button></form>'
    );
    $("#accessForm", modalBody).addEventListener("submit", function (ev) {
      ev.preventDefault();
      ACCESSES.push({
        id: genId("ACC"), nombre: $("#af-nombre", modalBody).value, email: $("#af-email", modalBody).value,
        telefono: $("#af-telefono", modalBody).value, studentId: $("#af-student", modalBody).value,
        tipo: $("#af-tipo", modalBody).value, estado: $("#af-estado", modalBody).value
      });
      closeModal();
      toast("Acceso creado en la demo. En una versión real, se enviaría una invitación al usuario.");
      redraw();
    });
  }

  function renderAdminAlumnos(root) {
    var ui = adminAlumnosUI;
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el('<div class="view-toggle" style="margin-bottom:20px;"><button type="button" id="tabAlumnos">Alumnos</button><button type="button" id="tabAccesos">Gestionar accesos</button></div>'));
    $("#tabAlumnos", root).classList.toggle("is-active", ui.tab === "alumnos");
    $("#tabAccesos", root).classList.toggle("is-active", ui.tab === "accesos");
    $("#tabAlumnos", root).addEventListener("click", function () { ui.tab = "alumnos"; renderAdminAlumnos(root); });
    $("#tabAccesos", root).addEventListener("click", function () { ui.tab = "accesos"; renderAdminAlumnos(root); });

    var body = el('<div id="alumnosBody"></div>');
    root.appendChild(body);

    if (ui.tab === "alumnos") {
      body.appendChild(el(
        '<div>' +
        '<div class="toolbar">' +
        '<input type="search" class="field-input search-input" placeholder="Buscar alumno..." id="alSearch">' +
        '<select class="filter-select" id="alEstado"><option value="todos">Todos los estados</option><option value="activo">Activos</option><option value="inactivo">Inactivos</option></select>' +
        '<button type="button" class="btn btn-primary btn-sm" id="btnAddStudent">Añadir alumno</button>' +
        '</div><div id="alList"></div></div>'
      ));
      function drawList() {
        var items = STUDENTS.filter(function (s) {
          var matchQ = !ui.q || s.nombre.toLowerCase().indexOf(ui.q.toLowerCase()) !== -1;
          var matchE = ui.estado === "todos" || s.estado === ui.estado;
          return matchQ && matchE;
        });
        var list = $("#alList", body);
        list.innerHTML = items.length ? '<div class="admin-table">' + items.map(function (s) {
          var a = activityById(s.activityId);
          return '<div class="admin-row" data-open-ficha="' + s.id + '">' +
            '<div class="admin-row-main"><strong>' + s.nombre + " (" + s.edad + " años)</strong>" +
            "<span>" + a.name + " · " + s.group + " · " + s.nivel + "</span></div>" +
            '<span class="status-pill status-' + (s.estado === "activo" ? "confirmada" : "cancelada") + '">' + (s.estado === "activo" ? "Activo" : "Inactivo") + "</span>" +
            (s.seguimiento ? '<span class="chip chip-urgent">Seguimiento</span>' : "") +
            '<button type="button" class="btn btn-sm btn-outline" data-open-ficha-btn="' + s.id + '">Ver ficha</button></div>';
        }).join("") + "</div>" : '<div class="empty-state">' + icon("user") + "<p>No hay alumnos que coincidan.</p></div>";
        $all("[data-open-ficha-btn]", list).forEach(function (btn) {
          btn.addEventListener("click", function () { openStudentFicha(studentById(btn.getAttribute("data-open-ficha-btn")), drawList); });
        });
      }
      $("#alSearch", body).addEventListener("input", function (e) { ui.q = e.target.value; drawList(); });
      $("#alEstado", body).addEventListener("change", function (e) { ui.estado = e.target.value; drawList(); });
      $("#btnAddStudent", body).addEventListener("click", function () { openStudentEditModal(null, drawList); });
      drawList();
    } else {
      body.appendChild(el('<div><div class="toolbar"><button type="button" class="btn btn-primary btn-sm" id="btnAddAccess">Crear acceso</button></div><div id="accList"></div></div>'));
      function drawAccess() {
        var list = $("#accList", body);
        list.innerHTML = ACCESSES.length ? '<div class="admin-table">' + ACCESSES.map(function (a) {
          var s = studentById(a.studentId);
          return '<div class="admin-row"><div class="admin-row-main"><strong>' + a.nombre + "</strong><span>" + a.email + " · " + (a.tipo === "tutor" ? "Tutor/familia" : "Alumno") + " · Asociado a " + (s ? s.nombre : "—") + "</span></div>" +
            '<span class="status-pill access-' + a.estado + '">' + accessStatusLabel(a.estado) + "</span>" +
            '<div class="admin-row-actions">' +
            '<button type="button" class="btn btn-sm btn-outline" data-toggle-access="' + a.id + '">' + (a.estado === "bloqueado" ? "Reactivar" : "Bloquear") + "</button>" +
            '<button type="button" class="btn btn-sm btn-ghost" data-reset-access="' + a.id + '">Restablecer contraseña</button>' +
            '<button type="button" class="btn btn-sm btn-ghost" data-invite-access="' + a.id + '">Generar invitación</button>' +
            "</div></div>";
        }).join("") + "</div>" : '<div class="empty-state">' + icon("user") + "<p>No hay accesos creados.</p></div>";
        $all("[data-toggle-access]", list).forEach(function (btn) {
          btn.addEventListener("click", function () {
            var a = ACCESSES.filter(function (x) { return x.id === btn.getAttribute("data-toggle-access"); })[0];
            a.estado = a.estado === "bloqueado" ? "activo" : "bloqueado";
            toast(a.estado === "bloqueado" ? "Acceso bloqueado en la demo." : "Acceso reactivado en la demo.");
            drawAccess();
          });
        });
        $all("[data-reset-access]", list).forEach(function (btn) { btn.addEventListener("click", function () { toast("Restablecimiento de contraseña simulado. En una versión real, se enviaría un enlace al usuario."); }); });
        $all("[data-invite-access]", list).forEach(function (btn) { btn.addEventListener("click", function () { toast("Invitación simulada generada. En una versión real, se enviaría al usuario."); }); });
      }
      $("#btnAddAccess", body).addEventListener("click", function () { openAccessFormModal(drawAccess); });
      drawAccess();
    }
  }

  /* ---------------- Admin: Grupos y actividades ---------------- */
  var ADMIN_GROUPS = {};
  ACTIVITIES.forEach(function (a) {
    ADMIN_GROUPS[a.id] = (GROUPS[a.id] || []).map(function (name) {
      var classes = ADMIN_CLASSES.filter(function (c) { return c.activityId === a.id && c.group === name; });
      var capacity = classes.length ? classes[0].capacity : 12;
      var occupied = classes.length ? Math.round(classes.reduce(function (s, c) { return s + c.occupied; }, 0) / classes.length) : 0;
      return { name: name, capacity: capacity, occupied: occupied, active: true };
    });
  });

  function activityFormFields(a) {
    a = a || {};
    return '<div class="field"><label for="actf-nombre">Nombre</label><input id="actf-nombre" required value="' + (a.name || "") + '"></div>' +
      '<div class="field"><label for="actf-what">Descripción breve</label><textarea id="actf-what" rows="2">' + (a.what || "") + "</textarea></div>" +
      '<div class="field"><label for="actf-forwhom">Edad o perfil orientativo</label><input id="actf-forwhom" value="' + (a.forWhom || "") + '"></div>' +
      '<div class="field"><label for="actf-level">Nivel</label><select id="actf-level"><option>Iniciación</option><option>Intermedio</option><option>Avanzado</option><option>Todos los niveles</option></select></div>' +
      '<div class="field"><label for="actf-duration">Duración de ejemplo</label><input id="actf-duration" value="' + (a.duration || "50 min (ejemplo)") + '"></div>' +
      '<div class="field"><label for="actf-age">Rango de edad</label><input id="actf-age" value="' + (a.ageRange || "") + '"></div>' +
      '<div class="field"><label for="actf-tipo">Categoría</label><select id="actf-tipo"><option value="judo">Judo</option><option value="complementaria">Complementaria</option></select></div>';
  }

  function renderAdminGrupos(root) {
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el('<div class="toolbar"><button type="button" class="btn btn-primary btn-sm" id="btnAddActivity">Crear actividad</button></div>'));
    $("#btnAddActivity", root).addEventListener("click", function () {
      openModal("Crear actividad", '<form id="activityForm">' + activityFormFields() + '<button type="submit" class="btn btn-primary btn-block">Crear actividad</button></form>');
      $("#activityForm", modalBody).addEventListener("submit", function (ev) {
        ev.preventDefault();
        var id = genId("act").toLowerCase();
        ACTIVITIES.push({ id: id, name: $("#actf-nombre", modalBody).value, what: $("#actf-what", modalBody).value, forWhom: $("#actf-forwhom", modalBody).value, level: $("#actf-level", modalBody).value, duration: $("#actf-duration", modalBody).value, ageRange: $("#actf-age", modalBody).value, availability: "Plazas disponibles", tipo: $("#actf-tipo", modalBody).value });
        GROUPS[id] = []; ADMIN_GROUPS[id] = [];
        closeModal();
        toast("Actividad creada en la demo.");
        renderAdminGrupos(root);
      });
    });

    ACTIVITIES.forEach(function (a) {
      var groups = ADMIN_GROUPS[a.id] || [];
      var card = el('<div class="card card-pad" style="margin-bottom:16px;">' +
        '<div class="admin-row-main" style="margin-bottom:10px;"><strong>' + a.name + "</strong><span>" + a.forWhom + " · " + a.level + "</span></div>" +
        '<div class="admin-row-actions" style="margin-bottom:12px;">' +
        '<button type="button" class="btn btn-sm btn-outline" data-edit-activity="' + a.id + '">Editar actividad</button>' +
        '<button type="button" class="btn btn-sm btn-outline" data-add-group="' + a.id + '">Crear grupo</button></div>' +
        '<div class="group-list">' + groups.map(function (g) {
          return '<div class="panel-row"><div class="panel-row-main"><strong>' + g.name + (g.active ? "" : " (inactivo)") + '</strong><span>' + g.occupied + " de " + g.capacity + " plazas</span></div>" +
            '<div class="occ-bar"><div class="occ-fill" style="width:' + Math.round(g.occupied / g.capacity * 100) + '%"></div></div>' +
            '<button type="button" class="btn btn-sm btn-outline" data-edit-group="' + a.id + '|' + g.name + '">Editar</button>' +
            '<button type="button" class="btn btn-sm btn-ghost" data-toggle-group="' + a.id + '|' + g.name + '">' + (g.active ? "Desactivar" : "Activar") + "</button></div>";
        }).join("") + "</div></div>");
      root.appendChild(card);
    });

    $all("[data-edit-activity]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = activityById(btn.getAttribute("data-edit-activity"));
        openModal("Editar actividad", '<form id="activityForm">' + activityFormFields(a) + '<button type="submit" class="btn btn-primary btn-block">Guardar cambios</button></form>');
        $("#actf-level", modalBody).value = a.level; $("#actf-tipo", modalBody).value = a.tipo;
        $("#activityForm", modalBody).addEventListener("submit", function (ev) {
          ev.preventDefault();
          a.name = $("#actf-nombre", modalBody).value; a.what = $("#actf-what", modalBody).value; a.forWhom = $("#actf-forwhom", modalBody).value;
          a.level = $("#actf-level", modalBody).value; a.duration = $("#actf-duration", modalBody).value; a.ageRange = $("#actf-age", modalBody).value; a.tipo = $("#actf-tipo", modalBody).value;
          closeModal();
          toast("Actividad actualizada en la demo.");
          renderAdminGrupos(root);
        });
      });
    });
    $all("[data-add-group]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var activityId = btn.getAttribute("data-add-group");
        openModal("Crear grupo", '<form id="groupForm"><div class="field"><label for="gf-nombre">Nombre del grupo</label><input id="gf-nombre" required></div><div class="field"><label for="gf-cap">Plazas máximas</label><input id="gf-cap" type="number" min="1" value="12"></div><button type="submit" class="btn btn-primary btn-block">Crear grupo</button></form>');
        $("#groupForm", modalBody).addEventListener("submit", function (ev) {
          ev.preventDefault();
          var name = $("#gf-nombre", modalBody).value;
          GROUPS[activityId].push(name);
          ADMIN_GROUPS[activityId].push({ name: name, capacity: Number($("#gf-cap", modalBody).value) || 12, occupied: 0, active: true });
          closeModal();
          toast("Grupo creado en la demo.");
          renderAdminGrupos(root);
        });
      });
    });
    $all("[data-edit-group]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.getAttribute("data-edit-group").split("|");
        var g = ADMIN_GROUPS[parts[0]].filter(function (x) { return x.name === parts[1]; })[0];
        openModal("Editar grupo", '<form id="groupEditForm"><div class="field"><label for="ge-cap">Plazas máximas</label><input id="ge-cap" type="number" min="1" value="' + g.capacity + '"></div><button type="submit" class="btn btn-primary btn-block">Guardar cambios</button></form>');
        $("#groupEditForm", modalBody).addEventListener("submit", function (ev) {
          ev.preventDefault();
          g.capacity = Number($("#ge-cap", modalBody).value) || g.capacity;
          closeModal();
          toast("Capacidad del grupo actualizada en la demo.");
          renderAdminGrupos(root);
        });
      });
    });
    $all("[data-toggle-group]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.getAttribute("data-toggle-group").split("|");
        var g = ADMIN_GROUPS[parts[0]].filter(function (x) { return x.name === parts[1]; })[0];
        g.active = !g.active;
        toast(g.active ? "Grupo activado en la demo." : "Grupo desactivado en la demo.");
        renderAdminGrupos(root);
      });
    });
  }

  /* ---------------- Admin: Avisos y comunicaciones ---------------- */
  var adminAvisosFilter = "todos";

  function noticeFormFields(n) {
    n = n || {};
    return '<div class="field"><label for="nf-title">Título</label><input id="nf-title" required value="' + (n.title || "") + '"></div>' +
      '<div class="field"><label for="nf-msg">Mensaje</label><textarea id="nf-msg" rows="3" required>' + (n.message || "") + "</textarea></div>" +
      '<div class="field"><label for="nf-cat">Categoría</label><select id="nf-cat">' + Object.keys(CATEGORY_LABEL).map(function (k) { return '<option value="' + k + '">' + CATEGORY_LABEL[k] + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="nf-aud">Destinatarios</label><select id="nf-aud"><option value="Todos">Todos</option>' + ACTIVITIES.map(function (a) { return (GROUPS[a.id] || []).map(function (g) { return '<option value="Grupo: ' + g + '">Grupo: ' + g + "</option>"; }).join(""); }).join("") + ACTIVITIES.map(function (a) { return '<option value="Actividad: ' + a.name + '">Actividad: ' + a.name + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="nf-prio">Prioridad</label><select id="nf-prio"><option value="normal">Normal</option><option value="urgente">Urgente</option></select></div>' +
      '<div class="field"><label for="nf-date">Fecha de publicación</label><input id="nf-date" type="date" value="' + (n.publishDate || isoDate(todayDate())) + '"></div>' +
      '<div class="field"><label for="nf-status">Estado</label><select id="nf-status"><option value="borrador">Borrador</option><option value="publicado">Publicado</option></select></div>';
  }

  function renderAdminAvisos(root) {
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el(
      '<div>' +
      '<div class="toolbar">' +
      '<div class="view-toggle"><button type="button" data-nf="todos">Todos</button><button type="button" data-nf="borrador">Borrador</button><button type="button" data-nf="publicado">Publicado</button><button type="button" data-nf="archivado">Archivado</button></div>' +
      '<button type="button" class="btn btn-primary btn-sm" id="btnCreateNotice">+ Crear aviso</button>' +
      "</div><div id=\"noticesBody\"></div></div>"
    ));
    $all("[data-nf]", root).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-nf") === adminAvisosFilter);
      btn.addEventListener("click", function () { adminAvisosFilter = btn.getAttribute("data-nf"); renderAdminAvisos(root); });
    });
    $("#btnCreateNotice", root).addEventListener("click", function () {
      openModal("Crear aviso", '<form id="noticeForm">' + noticeFormFields() + '<button type="submit" class="btn btn-primary btn-block">Guardar aviso</button></form>');
      $("#noticeForm", modalBody).addEventListener("submit", function (ev) {
        ev.preventDefault();
        var status = $("#nf-status", modalBody).value;
        var prio = $("#nf-prio", modalBody).value;
        NOTICES.unshift({
          id: genId("AV"), title: $("#nf-title", modalBody).value, message: $("#nf-msg", modalBody).value,
          category: $("#nf-cat", modalBody).value, audience: $("#nf-aud", modalBody).value, priority: prio,
          publishDate: status === "publicado" ? ($("#nf-date", modalBody).value || isoDate(todayDate())) : "",
          status: status, urgent: prio === "urgente", leidoAlumno: false
        });
        closeModal();
        toast(status === "publicado"
          ? "Aviso publicado en la demo. En una versión real, los alumnos recibirían una notificación según sus preferencias."
          : "Aviso guardado como borrador (simulado).");
        refreshNavBadges();
        renderAdminAvisos(root);
      });
    });

    var body = $("#noticesBody", root);
    var items = NOTICES.filter(function (n) { return adminAvisosFilter === "todos" || n.status === adminAvisosFilter; });
    body.innerHTML = items.length ? items.map(function (n) {
      return '<div class="card notice-card">' +
        '<div class="notice-card-head"><span class="chip">' + CATEGORY_LABEL[n.category] + "</span>" +
        (n.urgent ? '<span class="chip chip-urgent">Urgente</span>' : "") +
        '<span class="chip chip-status-' + n.status + '">' + n.status + "</span>" +
        '<span class="notice-date">' + (n.publishDate ? formatHuman(n.publishDate) : "Sin publicar") + "</span></div>" +
        "<h3>" + n.title + "</h3><p class=\"notice-msg\">" + n.message + '</p><p class="notice-audience">Para: ' + n.audience + "</p>" +
        '<div class="admin-row-actions">' +
        '<button type="button" class="btn btn-sm btn-outline" data-edit-notice="' + n.id + '">Editar</button>' +
        (n.status === "borrador" ? '<button type="button" class="btn btn-sm btn-primary" data-publish-notice="' + n.id + '">Publicar</button>' : "") +
        (n.status === "publicado" ? '<button type="button" class="btn btn-sm btn-outline" data-archive-notice="' + n.id + '">Archivar</button>' : "") +
        "</div></div>";
    }).join("") : '<div class="empty-state">' + icon("bell") + "<p>No hay avisos en esta vista.</p></div>";

    $all("[data-publish-notice]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = NOTICES.filter(function (x) { return x.id === btn.getAttribute("data-publish-notice"); })[0];
        n.status = "publicado"; if (!n.publishDate) n.publishDate = isoDate(todayDate());
        toast("Aviso publicado en la demo. En una versión real, los alumnos recibirían una notificación según sus preferencias.");
        refreshNavBadges();
        renderAdminAvisos(root);
      });
    });
    $all("[data-archive-notice]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = NOTICES.filter(function (x) { return x.id === btn.getAttribute("data-archive-notice"); })[0];
        n.status = "archivado";
        toast("Aviso archivado en la demo.");
        renderAdminAvisos(root);
      });
    });
    $all("[data-edit-notice]", body).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = NOTICES.filter(function (x) { return x.id === btn.getAttribute("data-edit-notice"); })[0];
        openModal("Editar aviso", '<form id="noticeForm">' + noticeFormFields(n) + '<button type="submit" class="btn btn-primary btn-block">Guardar cambios</button></form>');
        $("#nf-cat", modalBody).value = n.category; $("#nf-aud", modalBody).value = n.audience; $("#nf-prio", modalBody).value = n.priority; $("#nf-status", modalBody).value = n.status;
        $("#noticeForm", modalBody).addEventListener("submit", function (ev) {
          ev.preventDefault();
          n.title = $("#nf-title", modalBody).value; n.message = $("#nf-msg", modalBody).value; n.category = $("#nf-cat", modalBody).value;
          n.audience = $("#nf-aud", modalBody).value; n.priority = $("#nf-prio", modalBody).value; n.urgent = n.priority === "urgente";
          var newStatus = $("#nf-status", modalBody).value;
          if (newStatus === "publicado" && n.status !== "publicado" && !n.publishDate) n.publishDate = $("#nf-date", modalBody).value || isoDate(todayDate());
          n.status = newStatus;
          closeModal();
          toast("Aviso actualizado en la demo.");
          refreshNavBadges();
          renderAdminAvisos(root);
        });
      });
    });
  }

  /* ---------------- Admin: Automatizaciones ---------------- */
  function renderAdminAutomatizaciones(root) {
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el('<p class="section-lead">Representación visual de flujos automatizados. En esta demo los interruptores no activan integraciones reales.</p>'));
    root.appendChild(el('<div class="card" id="automationsCard">' +
      automations.map(function (a) {
        return '<div class="automation-row"><div><p class="automation-name">' + a.name + '</p><div class="automation-steps">' +
          a.steps.map(function (s, i) { return "<span>" + s + "</span>" + (i < a.steps.length - 1 ? '<span class="arrow">→</span>' : ""); }).join("") +
          "</div></div><button type=\"button\" class=\"switch" + (a.active ? " is-on" : "") + "\" data-automation=\"" + a.id + "\" aria-label=\"" + a.name + (a.active ? " activo" : " inactivo") + "\"></button></div>";
      }).join("") + "</div>"));
    $all("[data-automation]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = automations.filter(function (x) { return x.id === btn.getAttribute("data-automation"); })[0];
        a.active = !a.active;
        btn.classList.toggle("is-on", a.active);
        toast(a.name + ": automatización " + (a.active ? "activada" : "desactivada") + " (simulado)");
      });
    });
  }

  /* ---------------- Admin: Configuración ---------------- */
  function renderAdminConfig(root) {
    root.innerHTML = "";
    root.appendChild(el(adminBadge()));
    root.appendChild(el('<p class="section-lead">Datos de contacto público del club. Editar aquí cuando el club confirme datos reales.</p>'));
    root.appendChild(el(
      '<form id="configForm" class="card card-pad">' +
      '<div class="field"><label for="cfg-name">Nombre del club</label><input id="cfg-name" value="' + CLUB.name + '"></div>' +
      '<div class="field"><label for="cfg-address">Dirección</label><input id="cfg-address" value="' + CLUB.address + '"></div>' +
      '<div class="field"><label for="cfg-phone">Teléfono</label><input id="cfg-phone" value="' + CLUB.phone + '"></div>' +
      '<div class="field"><label for="cfg-email">Email</label><input id="cfg-email" value="' + CLUB.email + '"></div>' +
      '<div class="field"><label for="cfg-notice">Aviso destacado en Inicio</label><textarea id="cfg-notice" rows="2">' + CLUB.notice + "</textarea></div>" +
      '<button type="submit" class="btn btn-primary btn-block">Guardar cambios</button></form>'
    ));
    $("#configForm", root).addEventListener("submit", function (ev) {
      ev.preventDefault();
      CLUB.name = $("#cfg-name", root).value; CLUB.address = $("#cfg-address", root).value;
      CLUB.phone = $("#cfg-phone", root).value; CLUB.email = $("#cfg-email", root).value; CLUB.notice = $("#cfg-notice", root).value;
      toast("Datos del club actualizados en la demo.");
    });
  }

  /* ---------------- init ---------------- */
  loginScreen.hidden = false;
  appShell.hidden = true;
})();
