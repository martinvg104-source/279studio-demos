/* Academia Ejemplo — demo autocontenida. Vanilla JS, sin dependencias.
   Lógica de negocio igual que antes: elegir clase -> habilita botón -> enviar -> confirmación.
   Clase completa -> mensaje de lista de espera. Solo cambia el DOM (casillas de horario). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- horario por día (móvil) ---- */
  function initDayTabs() {
    var table = document.querySelector(".timetable");
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".daybar button"));
    if (!table || !tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
        table.setAttribute("data-day", tab.getAttribute("data-day"));
      });
    });
  }

  /* ---- reserva de clase ---- */
  function initBooking() {
    var form = document.getElementById("signup");
    if (!form) return;
    var classes = Array.prototype.slice.call(document.querySelectorAll(".class-btn"));
    var book = document.getElementById("book");
    var selectedLine = document.getElementById("selected");
    var confirm = document.getElementById("confirm");
    var confirmTitle = document.getElementById("confirm-title");
    var confirmBody = document.getElementById("confirm-body");
    var selected = null;

    function pick(btn) {
      classes.forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
      selected = btn;
      book.disabled = false;
      selectedLine.classList.add("has-pick");
      selectedLine.textContent = "Elegido: " + btn.getAttribute("data-label");
    }

    classes.forEach(function (btn) {
      btn.addEventListener("click", function () { pick(btn); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!selected) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var full = selected.getAttribute("data-full") === "true";
      if (full) {
        confirmTitle.textContent = "Estás en la lista de espera";
        confirmBody.textContent = "Esa clase está completa. Te avisaríamos por email en cuanto se libere una plaza. En esta demo no se envía nada.";
        book.textContent = "En lista de espera";
      } else {
        confirmTitle.textContent = "Plaza guardada";
        confirmBody.textContent = "Te escribiríamos por email para confirmar el grupo y el material. En esta demo no se envía nada.";
        book.textContent = book.getAttribute("data-done") || "Hecho";
      }
      book.setAttribute("data-state", "done");
      book.disabled = true;
      confirm.hidden = false;
      confirm.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  }

  initDayTabs();
  initBooking();
})();
