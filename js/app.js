class DemoApp {
  constructor() {
    this.pasoActual = 1;
    this.familiarValid = false;
    this.afectadoValid = false;

    // KPIs demo
    this.totalFam = 0;
    this.totalAfe = 0;
  }

  init() {
    this.setupEventListeners();
    this.mostrarPestana("Altas");
    this.mostrarPaso(1);

    this.autorrellenarUsu();
    this.touchFechaRegistro(); // auto rellena DD-MM-AAAA si está vacío

    this.actualizarUIEstado();
    console.log("✅ Sistema de Gestión Emerg inicializado");
  }

  // ===== Helpers =====
  qs(sel){ return document.querySelector(sel); }
  qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

  formatDateDDMMYYYY(d = new Date()) {
    const pad = n => String(n).padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  }

  autorrellenarUsu() {
    const url = new URL(window.location.href);
    const qUser = url.searchParams.get("user");
    const lsUser = localStorage.getItem("app_user");
    const user = qUser || lsUser || "demo-user";
    const usu = this.qs("#usu");
    if (usu) {
      if (!usu.value?.trim()) usu.value = user;
      localStorage.setItem("app_user", usu.value.trim());
    }
  }

  touchFechaRegistro() {
    const f = this.qs("#fecha-registro");
    if (f && !f.value?.trim()) f.value = this.formatDateDDMMYYYY();
  }

  // ===== Eventos =====
  setupEventListeners() {
    // Tabs principales
    this.qsa(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget?.dataset?.tab;
        if (tab) this.mostrarPestana(tab);
      });
    });

    // Stepper
    this.qsa(".paso").forEach(paso => {
      paso.addEventListener("click", (e) => {
        const nuevoPaso = parseInt(e.currentTarget?.dataset?.paso || "0", 10);
        if (!nuevoPaso) return;
        if (nuevoPaso === 2 && !this.familiarValid) {
          alert("⚠️ Debes validar el Familiar antes de pasar a Afectado.");
          return;
        }
        if (nuevoPaso === 3 && !(this.familiarValid && this.afectadoValid)) {
          alert("⚠️ Debes validar Familiar y Afectado antes de Confirmación.");
          return;
        }
        this.mostrarPaso(nuevoPaso);
      });
    });

    // Subpestañas
    this.qsa(".pestana-interna").forEach(pestana => {
      pestana.addEventListener("click", (e) => {
        const id = e.currentTarget?.dataset?.pestana;
        if (id) this.mostrarPestanaInterna(id);
      });
    });

    // Botones acción
    this.qs("#btnValidarFamiliar")?.addEventListener("click", () => this.validarFamiliar());
    this.qs("#btnSiguienteAfectado")?.addEventListener("click", () => this.mostrarPaso(2));
    this.qs("#btnValidarAfectado")?.addEventListener("click", () => this.validarAfectado());
    this.qs("#btnSiguienteConfirmacion")?.addEventListener("click", () => this.mostrarPaso(3));
    this.qs("#btnGuardarFinal")?.addEventListener("click", () => this.guardarRegistro());

    // Seguridad: todos los botones son type="button" por defecto
    this.qsa("button").forEach(b => {
      if (!b.getAttribute("type")) b.setAttribute("type", "button");
    });
  }

  // ===== Tabs =====
  mostrarPestana(tabName) {
    this.qsa(".tab-btn").forEach(btn => btn.classList.remove("active"));
    this.qsa(".tab-content").forEach(tab => tab.classList.remove("active"));
    this.qs(`[data-tab="${tabName}"]`)?.classList.add("active");
    this.qs(`#${tabName}`)?.classList.add("active");
  }

  // ===== Pasos =====
  mostrarPaso(numeroPaso) {
    this.pasoActual = numeroPaso;

    // Reset estados visuales
    this.qsa(".paso").forEach(p => p.classList.remove("activo", "completado", "bloqueado"));

    // Completados según flags
    if (this.familiarValid) this.qs(`[data-paso="1"]`)?.classList.add("completado");
    if (this.afectadoValid) this.qs(`[data-paso="2"]`)?.classList.add("completado");

    // Bloqueos
    if (!this.familiarValid) this.qs(`[data-paso="2"]`)?.classList.add("bloqueado");
    if (!(this.familiarValid && this.afectadoValid)) this.qs(`[data-paso="3"]`)?.classList.add("bloqueado");

    // Activo
    this.qs(`[data-paso="${numeroPaso}"]`)?.classList.add("activo");

    // Mostrar contenido
    this.qsa(".form-paso").forEach(p => p.classList.remove("activo"));
    this.qs(`#paso-${this.getPasoName(numeroPaso)}`)?.classList.add("activo");

    // Subpestaña por defecto
    if (numeroPaso === 1) this.mostrarPestanaInterna("familiar-1");
    if (numeroPaso === 2) this.mostrarPestanaInterna("afectado-1");

    // Resumen al entrar al 3
    if (numeroPaso === 3) this.refrescarResumen();

    // Scroll suave al inicio del contenedor (mejor UX)
    this.qs(".alta-container")?.scrollIntoView({ behavior: "smooth", block: "start" });

    this.actualizarUIEstado();
  }

  getPasoName(n){ return ({1:"familiar",2:"afectado",3:"confirmacion"})[n]; }

  // ===== Subpestañas =====
  mostrarPestanaInterna(id) {
    this.qsa(".pestana-interna").forEach(p => p.classList.remove("activa"));
    this.qs(`.pestana-interna[data-pestana="${id}"]`)?.classList.add("activa");
    this.qsa(".contenido-pestana").forEach(c => c.classList.remove("activa"));
    this.qs(`#${id}`)?.classList.add("activa");
  }

  // ===== Validaciones =====
  validarFamiliar() {
    const nombre = this.qs("#nombre")?.value?.trim();
    const apell = this.qs("#apellidos")?.value?.trim();
    const tel   = this.qs("#telefono-principal")?.value?.trim();

    if (!(nombre && apell && tel)) {
      alert("⚠️ Completa Nombre, Apellidos y Teléfono del Familiar.");
      this.familiarValid = false;
      this.actualizarUIEstado();
      return;
    }

    this.familiarValid = true;
    alert("✅ Familiar validado correctamente.");

    // Sugerencia UX: tras validar, abrir la subpestaña Contacto si no lo estaba
    this.mostrarPestanaInterna("familiar-2");

    this.actualizarUIEstado();
  }

  validarAfectado() {
    if (!this.familiarValid) {
      alert("⚠️ Primero valida el Familiar.");
      return;
    }
    const nom = this.qs("#afeNombre")?.value?.trim();
    const ape = this.qs("#afeApellidos")?.value?.trim();
    if (!(nom && ape)) {
      alert("⚠️ Completa Nombre y Apellidos del Afectado.");
      this.afectadoValid = false;
      this.actualizarUIEstado();
      return;
    }
    this.afectadoValid = true;
    alert("✅ Afectado validado correctamente.");
    this.actualizarUIEstado();
  }

  // ===== Resumen =====
  refrescarResumen() {
    // Meta
    this.setText("#rUsu", this.qs("#usu")?.value || "—");
    this.setText("#rFechaRegistro", this.qs("#fecha-registro")?.value || "—");

    // Familiar
    this.setText("#rFamNombre", this.qs("#nombre")?.value || "—");
    this.setText("#rFamApellidos", this.qs("#apellidos")?.value || "—");
    this.setText("#rFamTelefono", this.qs("#telefono-principal")?.value || "—");
    this.setText("#rFamEmail", this.qs("#email")?.value || "—");
    this.setText("#rFamRelacion", this.qs("#relacion")?.value || "—");
    this.setText("#rCodFamiliar", this.qs("#cod-familiar")?.value || "—");

    // Afectado
    this.setText("#rAfeNombre",  this.qs("#afeNombre")?.value || "—");
    this.setText("#rAfeApellidos", this.qs("#afeApellidos")?.value || "—");
    this.setText("#rAfeDoc",     this.qs("#afeDoc")?.value || "—");
    this.setText("#rAfeEdad",    this.qs("#afeEdad")?.value || "—");
    this.setText("#rAfeEstado",  this.qs("#afeEstado")?.value || "—");
    this.setText("#rAfeNotas",   this.qs("#afeNotas")?.value || "—");
    this.setText("#rCodVictimaRelacion", this.qs("#cod-victima-relacion")?.value || "—");
  }

  setText(sel, val) { const el = this.qs(sel); if (el) el.textContent = val || "—"; }

  // ===== Guardado =====
  guardarRegistro() {
    if (!(this.familiarValid && this.afectadoValid)) {
      alert("⚠️ Debes validar Familiar y Afectado antes de guardar.");
      return;
    }

    // Sello de fecha (DD-MM-AAAA) antes de persistir
    const f = this.qs("#fecha-registro");
    if (f) f.value = this.formatDateDDMMYYYY();

    // Aquí iría tu POST/PATCH real a SharePoint/Power Automate/etc.
    alert("💾 DEMO: Registro guardado correctamente.");

    // KPIs demo
    this.totalFam += 1;
    this.totalAfe += 1;
    this.qs("#kpiFam") && (this.qs("#kpiFam").textContent = this.totalFam);
    this.qs("#kpiAfe") && (this.qs("#kpiAfe").textContent = this.totalAfe);

    // Reset flujo (conservar Usu); limpiar campos para la siguiente alta
    this.familiarValid = false;
    this.afectadoValid = false;

    [
      "fecha-registro", "cod-familiar", "cod-victima-relacion",
      "control-familiar","apellidos","nombre","edad","relacion","dni","nacionalidad",
      "email","telefono-principal","telefono-secundario","direccion-permanente","direccion-temporal",
      "nombre-portavoz",
      "afeNombre","afeApellidos","afeDoc","afeEdad","afeEstado","afeNotas"
    ].forEach(id => { const el = this.qs("#"+id); if (el) el.value = ""; });

    // Uncheck y selects múltiples
    this.qs("#portavoz") && (this.qs("#portavoz").checked = false);
    const mult = this.qs("#necesidades-especiales");
    if (mult && mult.options) Array.from(mult.options).forEach(o => o.selected = false);

    // Fecha de la siguiente alta
    this.touchFechaRegistro();

    // Volver al Paso 1
    this.mostrarPaso(1);
  }

  actualizarUIEstado() {
    // Botón Guardar visible solo si ambos validados
    const btnGuardar = this.qs("#btnGuardarFinal");
    if (btnGuardar) btnGuardar.style.display = (this.familiarValid && this.afectadoValid) ? "inline-flex" : "none";

    // Bloqueos visuales
    this.qsa(".paso").forEach(p => {
      const pasoNum = parseInt(p.dataset?.paso || "0", 10);
      let bloqueado = false;
      if (pasoNum === 2 && !this.familiarValid) bloqueado = true;
      if (pasoNum === 3 && !(this.familiarValid && this.afectadoValid)) bloqueado = true;
      p.classList.toggle("bloqueado", bloqueado);
      p.style.pointerEvents = bloqueado ? "none" : "auto";
    });

    // Completados
    this.qs(`[data-paso="1"]`)?.classList.toggle("completado", this.familiarValid);
    this.qs(`[data-paso="2"]`)?.classList.toggle("completado", this.afectadoValid);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new DemoApp();
  window.app.init();
});
