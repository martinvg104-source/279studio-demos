/* Fisioterapia Ejemplo — demo autocontenida. Vanilla JS, sin dependencias.
   Lógica de negocio igual que antes: elegir hueco -> habilita botón -> enviar -> confirmación.
   Hueco completo -> aviso del siguiente hueco. La silueta fija "Zona" (opcional). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var figure = document.querySelector(".figure");
  var zones = Array.prototype.slice.call(document.querySelectorAll(".zone"));
  var blobs = Array.prototype.slice.call(document.querySelectorAll(".blob"));
  var zonaOut = document.getElementById("zona-out");
  var markedZone = null;

  function currentSide() {
    return figure ? figure.getAttribute("data-side") : "frente";
  }
  function zoneLabel(btn) {
    return btn.getAttribute("data-label-" + currentSide()) || btn.getAttribute("data-zone");
  }
  function refreshZonaOut() {
    zonaOut.textContent = "";
    if (markedZone) {
      zonaOut.append("Zona: " + zoneLabel(markedZone));
      zonaOut.classList.add("marked");
    } else {
      var opt = document.createElement("span");
      opt.className = "opt";
      opt.textContent = "(opcional)";
      zonaOut.append("Zona: sin marcar ", opt);
      zonaOut.classList.remove("marked");
    }
  }

  /* ---- frente / espalda ---- */
  function initSideToggle() {
    var btns = Array.prototype.slice.call(document.querySelectorAll(".side-toggle button"));
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        figure.setAttribute("data-side", b.getAttribute("data-side"));
        refreshZonaOut();
      });
    });
  }

  /* ---- zona del cuerpo ---- */
  function initZones() {
    zones.forEach(function (z) {
      z.addEventListener("click", function () {
        var name = z.getAttribute("data-zone");
        zones.forEach(function (x) { x.setAttribute("aria-pressed", String(x === z)); });
        blobs.forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-zone") === name); });
        markedZone = z;
        refreshZonaOut();
      });
    });
  }

  /* ---- huecos + envío ---- */
  function initBooking() {
    var form = document.getElementById("datos");
    if (!form) return;
    var slots = Array.prototype.slice.call(document.querySelectorAll(".slot"));
    var ask = document.getElementById("ask");
    var confirm = document.getElementById("confirm");
    var confirmTitle = document.getElementById("confirm-title");
    var confirmBody = document.getElementById("confirm-body");
    var selected = null;

    slots.forEach(function (s) {
      s.addEventListener("click", function () {
        slots.forEach(function (x) { x.setAttribute("aria-pressed", String(x === s)); });
        selected = s;
        ask.disabled = false;
      });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!selected) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var full = selected.getAttribute("data-full") === "true";
      if (full) {
        confirmTitle.textContent = "Te avisamos del siguiente hueco";
        confirmBody.textContent = "Ese hueco está completo. Te llamaríamos en cuanto se libere uno antes. En esta demo no se envía nada.";
        ask.textContent = "En lista de aviso";
      } else {
        var when = selected.querySelector(".s-when").textContent.trim();
        var who = selected.querySelector(".s-who").textContent.trim().split(" · ")[0];
        var zonaTxt = markedZone ? " Le decimos que vienes por " + zoneLabel(markedZone) + "." : "";
        confirmTitle.textContent = "Cita pedida";
        confirmBody.textContent = "Te esperamos el " + when + " con " + who + "." + zonaTxt + " Te llamaríamos para confirmar. En esta demo no se envía nada.";
        ask.textContent = ask.getAttribute("data-done") || "Hecho";
      }
      ask.setAttribute("data-state", "done");
      ask.disabled = true;
      confirm.hidden = false;
      confirm.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  }

  /* ---- arco de movilidad ---- */
  function initRom() {
    var rom = document.querySelector(".rom");
    if (!rom) return;
    if (reduceMotion || !("IntersectionObserver" in window)) { rom.classList.add("in"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { rom.classList.add("in"); io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(rom);
  }

  initSideToggle();
  initZones();
  initBooking();
  initRom();
})();
