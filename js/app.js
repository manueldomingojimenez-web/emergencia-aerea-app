// app.js — versión unificada con gating, validaciones y compatibilidad con selectores "viejos" y "nuevos"

class DemoApp {
  constructor() {
    this.pasoActual = 1;
    this.familiarValid = false;
    this.afectadoValid = false;

    // KPIs demo (si los usas en Dashboard)
    this.totalFam = 0;
    this.totalAfe = 0;
  }

  init() {
    this.setupEventListeners();
    // Pestaña por defecto
    this.mostrarPestana("Altas");
    // Paso por defecto
    this.mostrarPaso(1);
    this.actualizarUIEstado();
    console.log("✅ Sistema de Gestión Emerg inicializado");
  }

  // Helpers de selección
  qs(sel) { return document.querySelector(sel); }
  qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  // Selectores con retrocompatibilidad (.tab-btn | .tab) ; (.paso | .step)
  get tabButtons() { return this.qsa(".tab-btn").length ? this.qsa(".tab-btn") : this.qsa(".tab"); }
  get stepItems()  { return this.qsa(".paso").length ? this.qsa(".paso") : this.qsa(".step"); }
  get saveBtn()    { return this.qs("#btnGuardarFinal") || this.qs("#guardarBtn"); }

  setupEventListeners() {
    // Tabs principales
    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget?.dataset?.tab || e.currentTarget?.textContent?.trim() || "Altas";
        this.mostrarPestana(tab);
      });
    });

    // Stepper
    this.stepItems.forEach(paso => {
      paso.addEventListener("click", (e) => {
        const nuevoPaso = parseInt(e.currentTarget?.dataset?.paso || "0", 10);
        if (!nuevoPaso) return;
        // Gating
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

    // Subpestañas (familiar/afectado)
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
    this.saveBtn?.addEventListener("click", () => this.guardarRegistro());

    // Efectos de foco (suaves, no intrusivos)
    this.qsa("input, select, textarea").forEach(field => {
      field.addEventListener("focus", function () { this.style.boxShadow = "0 0 0 3px rgba(52,152,219,.1)"; });
      field.addEventListener("blur", function () { this.style.boxShadow = "none"; });
    });
  }

  // Tabs principales
  mostrarPestana(tabName) {
    // Desactivar todo
    this.tabButtons.forEach(btn => btn.classList.remove("active"));
    this.qsa(".tab-content").forEach(tab => tab.classList.remove("active"));

    // Activar seleccionado (por data-tab si existe, si no por texto)
    const btn = this.tabButtons.find(b => (b.dataset?.tab === tabName) || (b.textContent?.trim() === tabName));
    btn?.classList.add("active");

    // Mostrar contenedor con #id = tabName (Altas, Consultas, Dashboard)
    this.qs(`#${tabName}`)?.classList.add("active");
  }

  // Stepper (1 familiar, 2 afectado, 3 confirmación)
  mostrarPaso(numeroPaso) {
    this.pasoActual = numeroPaso;

    // Reset estados visuales
    this.stepItems.forEach(p => p.classList.remove("activo", "active", "completado", "bloqueado"));

    // Completados según flags
    const s1 = this.stepItems.find(s => (s.dataset?.paso === "1"));
    const s2 = this.stepItems.find(s => (s.dataset?.paso === "2"));
    const s3 = this.stepItems.find(s => (s.dataset?.paso === "3"));
    if (this.familiarValid) s1?.classList.add("completado");
    if (this.afectadoValid) s2?.classList.add("completado");

    // Bloqueos
    if (!this.familiarValid) s2?.classList.add("bloqueado");
    if (!(this.familiarValid && this.afectadoValid)) s3?.classList.add("bloqueado");

    // Activo actual (soporta .activo y .active)
    const current = this.stepItems.find(s => (s.dataset?.paso === String(numeroPaso)));
    current?.classList.add("activo");
    current?.classList.add("active");

    // Mostrar contenido del paso
    this.qsa(".form-paso").forEach(p => p.classList.remove("activo"));
    const idCont = `#paso-${this.getPasoName(numeroPaso)}`;
    this.qs(idCont)?.classList.add("activo");

    // Subpestañas por defecto
    if (numeroPaso === 1) this.mostrarPestanaInterna("familiar-1");
    if (numeroPaso === 2) this.mostrarPestanaInterna("afectado-1");

    // Resumen si vamos a 3
    if (numeroPaso === 3) this.refrescarResumen();

    this.actualizarUIEstado();
  }

  getPasoName(n) { return ({1:"familiar", 2:"afectado", 3:"confirmacion"})[n]; }

  // Subtabs
  mostrarPestanaInterna(id) {
    this.qsa(".pestana-interna").forEach(p => p.classList.remove("activa"));
    this.qs(`.pestana-interna[data-pestana="${id}"]`)?.classList.add("activa");
    this.qsa(".contenido-pestana").forEach(c => c.classList.remove("activa"));
    this.qs(`#${id}`)?.classList.add("activa");
  }

  // === Validaciones ===
  validarFamiliar() {
    // Compatibilidad de IDs:
    // - En mi index: #nombre, #apellidos, #telefono-principal
    // - En tu versión previa: podrías usar .required-field; mantenemos también eso como fallback
    const nombre  = this.qs("#nombre")?.value?.trim() || this.qs("#famNombre")?.value?.trim();
    const apell   = this.qs("#apellidos")?.value?.trim() || this.qs("#famApellidos")?.value?.trim();
    const tel     = this.qs("#telefono-principal")?.value?.trim() || this.qs("#famTelefono")?.value?.trim();

    // Si hay .required-field, las repasamos también
    const reqFields = this.qsa(".required-field");
    let reqOK = true;
    reqFields.forEach(f => { if (!f.value?.trim()) reqOK = false; });

    const ok = (!!nombre && !!apell && !!tel) || reqOK;

    if (!ok) {
      alert("⚠️ Completa Nombre, Apellidos y Teléfono del Familiar.");
      this.familiarValid = false;
      this.actualizarUIEstado();
      return;
    }

    this.familiarValid = true;
    alert("✅ Familiar validado correctamente.");
    this.actualizarUIEstado();
  }

  validarAfectado() {
    if (!this.familiarValid) {
      alert("⚠️ Primero valida el Familiar.");
      return;
    }
    const nom = this.qs("#afeNombre")?.value?.trim();
    const ape = this.qs("#afeApellidos")?.value?.trim();
    const ok = (!!nom && !!ape);

    if (!ok) {
      alert("⚠️ Completa Nombre y Apellidos del Afectado.");
      this.afectadoValid = false;
      this.actualizarUIEstado();
      return;
    }

    this.afectadoValid = true;
    alert("✅ Afectado validado correctamente.");
    this.actualizarUIEstado();
  }

  // === Resumen ===
  refrescarResumen() {
    // Familiar (IDs del index nuevo; si no existen, usamos fallback donde tenga sentido)
    this.setText("#rFamNombre",    this.qs("#nombre")?.value || this.qs("#famNombre")?.value || "—");
    this.setText("#rFamApellidos", this.qs("#apellidos")?.value || this.qs("#famApellidos")?.value || "—");
    this.setText("#rFamTelefono",  this.qs("#telefono-principal")?.value || this.qs("#famTelefono")?.value || "—");
    this.setText("#rFamEmail",     this.qs("#email")?.value || this.qs("#famEmail")?.value || "—");
    this.setText("#rFamRelacion",  this.qs("#relacion")?.value || this.qs("#famRelacion")?.value || "—");

    // Afectado
    this.setText("#rAfeNombre",  this.qs("#afeNombre")?.value || "—");
    this.setText("#rAfeApellidos", this.qs("#afeApellidos")?.value || "—");
    this.setText("#rAfeDoc",     this.qs("#afeDoc")?.value || "—");
    this.setText("#rAfeEdad",    this.qs("#afeEdad")?.value || "—");
    this.setText("#rAfeEstado",  this.qs("#afeEstado")?.value || "—");
    this.setText("#rAfeNotas",   this.qs("#afeNotas")?.value || "—");
  }

  setText(sel, val) { const el = this.qs(sel); if (el) el.textContent = val || "—"; }

  // === Guardado ===
  guardarRegistro() {
    if (!(this.familiarValid && this.afectadoValid)) {
      alert("⚠️ Debes validar Familiar y Afectado antes de guardar.");
      return;
    }

    // Aquí integras la llamada real (SharePoint / API / Power Automate…)
    // DEMO:
    this.saveBtn.innerHTML = "✓ Guardando...";
    this.saveBtn.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";

    setTimeout(() => {
      alert("💾 Registro guardado correctamente.");
      this.saveBtn.innerHTML = "Guardar";
      this.saveBtn.style.background = "";

      // KPIs demo
      this.totalFam += 1; this.totalAfe += 1;
      this.qs("#kpiFam") && (this.qs("#kpiFam").textContent = this.totalFam);
      this.qs("#kpiAfe") && (this.qs("#kpiAfe").textContent = this.totalAfe);

      // Reset flujo + limpiar campos habituales
      this.familiarValid = false; this.afectadoValid = false;
      [
        "control-familiar","apellidos","nombre","edad","relacion","dni","nacionalidad",
        "email","telefono-principal","telefono-secundario","direccion-permanente","direccion-temporal",
        "nombre-portavoz","codigo-familiar","codigo-victima",
        "afeNombre","afeApellidos","afeDoc","afeEdad","afeEstado","afeNotas",
        "famNombre","famApellidos","famTelefono","famEmail","famRelacion"
      ].forEach(id => { const el = this.qs("#"+id); if (el) el.value = ""; });

      // Uncheck checkboxes/selects múltiples
      this.qs("#portavoz") && (this.qs("#portavoz").checked = false);
      const mult = this.qs("#necesidades-especiales");
      if (mult && mult.options) Array.from(mult.options).forEach(o => o.selected = false);

      this.mostrarPaso(1);
    }, 800);
  }

  actualizarUIEstado() {
    // Mostrar/ocultar Guardar
    if (this.saveBtn) this.saveBtn.style.display = (this.familiarValid && this.afectadoValid) ? "inline-flex" : "none";

    // Bloqueos visuales y puntero
    this.stepItems.forEach(p => {
      const pasoNum = parseInt(p.dataset?.paso || "0", 10);
      let bloqueado = false;
      if (pasoNum === 2 && !this.familiarValid) bloqueado = true;
      if (pasoNum === 3 && !(this.familiarValid && this.afectadoValid)) bloqueado = true;
      p.classList.toggle("bloqueado", bloqueado);
      p.style.pointerEvents = bloqueado ? "none" : "auto";
      p.style.opacity = bloqueado ? "0.5" : "1";
    });

    // Marcar completados
    const s1 = this.stepItems.find(s => (s.dataset?.paso === "1"));
    const s2 = this.stepItems.find(s => (s.dataset?.paso === "2"));
    s1?.classList.toggle("completado", this.familiarValid);
    s2?.classList.toggle("completado", this.afectadoValid);
  }
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  window.app = new DemoApp();
  window.app.init();
});
