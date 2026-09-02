/* Academia Ejemplo — demo autocontenida. Vanilla JS, sin dependencias. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll reveal: cascada por grupo de hermanos (70ms, tope 6) ---- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var groups = new Map();
    items.forEach(function (el) {
      var parent = el.parentNode;
      if (!groups.has(parent)) groups.set(parent, 0);
      var i = groups.get(parent);
      el.style.setProperty("--reveal-delay", Math.min(i, 6) * 70 + "ms");
      groups.set(parent, i + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- reserva ---- */
  function initBooking() {
    var form = document.getElementById("booking");
    if (!form) return;
    var slots = Array.prototype.slice.call(form.querySelectorAll(".slot"));
    var btn = document.getElementById("confirmBtn");
    var confirm = document.getElementById("confirm");
    var confirmMsg = document.getElementById("confirmMsg");
    var selected = null;

    function selectSlot(slot) {
      slots.forEach(function (s) { s.setAttribute("aria-pressed", String(s === slot)); });
      selected = slot;
      btn.disabled = false;
    }

    slots.forEach(function (slot) {
      slot.addEventListener("click", function () { selectSlot(slot); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!selected) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var full = selected.getAttribute("data-full") === "true";
      confirmMsg.textContent = full ? "En lista de espera" : "Plaza reservada";
      confirm.querySelector(".stamp").textContent = full ? "EN ESPERA" : "CONFIRMADA";
      confirm.hidden = false;
      btn.textContent = btn.getAttribute("data-done") || "Hecho";
      btn.setAttribute("data-state", "done");
      btn.disabled = true;
      confirm.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  }

  initReveal();
  initBooking();
})();
