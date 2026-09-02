/* Taller Ejemplo — demo autocontenida. Vanilla JS, sin dependencias.
   Lógica de negocio igual que antes: marcar servicios -> se construye la estimación;
   elegir hueco -> habilita botón -> enviar -> confirmación con nº de OT.
   Hueco completo -> aviso del siguiente hueco. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var euro = function (n) { return n.toLocaleString("es-ES") + " €"; };

  var checks = Array.prototype.slice.call(document.querySelectorAll(".checklist input"));
  var estRows = document.getElementById("est-rows");
  var estSub = document.getElementById("est-sub");
  var estTotal = document.getElementById("est-total");
  var sbTotal = document.getElementById("sb-total");
  var slots = Array.prototype.slice.call(document.querySelectorAll(".slot"));
  var form = document.getElementById("ot");
  var submitBtn = document.getElementById("submit");
  var sbBtn = document.getElementById("sb-submit");
  var confirmBox = document.getElementById("confirm");
  var confirmBody = document.getElementById("confirm-body");

  var selectedSlot = null;
  var seenJobs = {};
  var lastSub = 0;
  var lastTotal = 0;

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function countTo(el, from, to) {
    if (reduceMotion || from === to) { el.textContent = euro(to); return; }
    var start = performance.now();
    var dur = 180;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = euro(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function emptyRow() {
    var tr = document.createElement("tr");
    tr.className = "est-empty";
    var td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = "Marca un trabajo para ver la estimación.";
    tr.appendChild(td);
    return tr;
  }

  function jobRow(job, piezas, mano, animate) {
    var tr = document.createElement("tr");
    tr.className = "est-job" + (animate ? " est-row-anim" : "");
    [job, piezas ? euro(piezas) : "—", mano ? euro(mano) : "—"].forEach(function (val, i) {
      var td = document.createElement("td");
      if (i > 0) td.className = "num";
      td.textContent = val;
      tr.appendChild(td);
    });
    return tr;
  }

  function refreshSubmit() {
    var ok = checks.some(function (c) { return c.checked; }) && !!selectedSlot;
    submitBtn.disabled = !ok;
    sbBtn.disabled = !ok;
  }

  function rebuildEstimate() {
    var chosen = checks.filter(function (c) { return c.checked; });
    var sub = 0;
    clear(estRows);

    if (!chosen.length) {
      estRows.appendChild(emptyRow());
      seenJobs = {};
    } else {
      var stillHere = {};
      chosen.forEach(function (c) {
        var piezas = parseInt(c.getAttribute("data-piezas"), 10) || 0;
        var mano = parseInt(c.getAttribute("data-mano"), 10) || 0;
        var job = c.getAttribute("data-job");
        sub += piezas + mano;
        var isNew = !seenJobs[job] && !reduceMotion;
        estRows.appendChild(jobRow(job, piezas, mano, isNew));
        stillHere[job] = true;
      });
      seenJobs = stillHere;
    }

    var total = Math.round(sub * 1.21);
    countTo(estSub, lastSub, sub);
    countTo(estTotal, lastTotal, total);
    countTo(sbTotal, lastTotal, total);
    lastSub = sub;
    lastTotal = total;
    refreshSubmit();
  }

  checks.forEach(function (c) { c.addEventListener("change", rebuildEstimate); });

  slots.forEach(function (s) {
    s.addEventListener("click", function () {
      slots.forEach(function (x) { x.setAttribute("aria-pressed", String(x === s)); });
      selectedSlot = s;
      refreshSubmit();
    });
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!selectedSlot || !checks.some(function (c) { return c.checked; })) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var when = selectedSlot.getAttribute("data-when");
    var full = selectedSlot.getAttribute("data-full") === "true";
    if (full) {
      confirmBody.textContent = "Ese hueco (" + when + ") está completo. Te llamamos en cuanto se libere uno antes para darte entrada y cerrar el presupuesto. En esta demo no se envía nada.";
    } else {
      var ot = "OT-" + (2200 + Math.floor(Math.random() * 90));
      confirmBody.textContent = "Nº de orden " + ot + " · entrada el " + when + ". Guarda este número; te avisamos por WhatsApp cuando esté listo. En esta demo no se envía nada.";
    }
    submitBtn.textContent = submitBtn.getAttribute("data-done") || "Hecho";
    sbBtn.textContent = "Cita pedida";
    [submitBtn, sbBtn].forEach(function (b) {
      b.setAttribute("data-state", "done");
      b.disabled = true;
    });
    confirmBox.hidden = false;
    confirmBox.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  });

  rebuildEstimate();
})();
