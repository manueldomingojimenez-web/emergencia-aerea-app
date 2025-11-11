class DemoApp {
  constructor() {
    this.pasoActual = 1;
    this.familiarValid = false;
    this.afectadoValid = false;

    // KPIs demo
    this.totalFam = 0;
    this.totalAfe = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.mostrarPestana("Altas");
    this.mostrarPaso(1);
    this.actualizarUIEstado();
    console.log("✅ Demo app inicializada");
  }

  qs(sel){ return document.querySelector(sel); }
  qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

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
  }

  mostrarPestana(tabName) {
    this.qsa(".tab-btn").forEach(btn => btn.classList.remove("active"));
    this.qsa(".tab-content").forEach(tab => tab.classList.remove("active"));
    this.qs(`[data-tab="${tabName}"]`)?.classList.add("active");
    this.qs(`#${tabName}`)?.classList.add("active");
  }

  mostrarPaso(numeroPaso) {
    this.pasoActual = numeroPaso;

    // Reset estados visuales
    this.qsa(".paso").forEach(p => p.classList.remove("activo", "completado", "bloqueado"));

    // Completados según flags
    if (this.familiarValid) this.qs(`[data-paso="1"]`)?.classList.add("completado");
    if (this.afectadoValid) this.qs(`[data-paso="2"]`)?.classList.add("completado");

    // Bloqueos según estado
    if (!this.familiarValid) this.qs(`[data-paso="2"]`)?.classList.add("bloqueado");
    if (!(this.familiarValid && this.afectadoValid)) this.qs(`[data-paso="3"]`)?.classList.add("bloqueado");

    // Activo actual
    this.qs(`[data-paso="${numeroPaso}"]`)?.classList.add("activo");

    // Mostrar contenido del paso
    this.qsa(".form-paso").forEach(p => p.classList.remove("activo"));
    this.qs(`#paso-${this.getPasoName(numeroPaso)}`)?.classList.add("activo");

    // Subpestaña por defecto
    if (numeroPaso === 1) this.mostrarPestanaInterna("familiar-1");
    if (numeroPaso === 2) this.mostrarPestanaInterna("afectado-1");

    // Resumen en paso 3
    if (numeroPaso === 3) this.refrescarResumen();

    this.actualizarUIEstado();
  }

  getPasoName(n){ return ({1:"familiar",2:"afectado",3:"confirmacion"})[n]; }

  mostrarPestanaInterna(id) {
    this.qsa(".pestana-interna").forEach(p => p.classList.remove("activa"));
    this.qsa(`.pestana-interna[data-pestana="${id}"]`)?.classList.add("activa");
    this.qsa(".contenido-pestana").forEach(c => c.classList.remove("activa"));
    this.qs(`#${id}`)?.classList.add("activa");
  }

  validarFamiliar() {
    const ok =
      this.qs("#famNombre")?.value?.trim() &&
      this.qs("#famApellidos")?.value?.trim() &&
      this.qs("#famTelefono")?.value?.trim();

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

    const ok =
      this.qs("#afeNombre")?.value?.trim() &&
      this.qs("#afeApellidos")?.value?.trim();

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

  refrescarResumen() {
    // Familiar
    this.qs("#rFamNombre").textContent = this.qs("#famNombre")?.value || "—";
    this.qs("#rFamApellidos").textContent = this.qs("#famApellidos")?.value || "—";
    this.qs("#rFamTelefono").textContent = this.qs("#famTelefono")?.value || "—";
    this.qs("#rFamEmail").textContent = this.qs("#famEmail")?.value || "—";
    this.qs("#rFamRelacion").textContent = this.qs("#famRelacion")?.value || "—";

    // Afectado
    this.qs("#rAfeNombre").textContent = this.qs("#afeNombre")?.value || "—";
    this.qs("#rAfeApellidos").textContent = this.qs("#afeApellidos")?.value || "—";
    this.qs("#rAfeDoc").textContent = this.qs("#afeDoc")?.value || "—";
    this.qs("#rAfeEdad").textContent = this.qs("#afeEdad")?.value || "—";
    this.qs("#rAfeEstado").textContent = this.qs("#afeEstado")?.value || "—";
    this.qs("#rAfeNotas").textContent = this.qs("#afeNotas")?.value || "—";
  }

  guardarRegistro() {
    if (!(this.familiarValid && this.afectadoValid)) {
      alert("⚠️ Debes validar Familiar y Afectado antes de guardar.");
      return;
    }

    // Aquí integras tu POST/PATCH real (SharePoint, API, etc.)
    alert("💾 DEMO: Registro guardado correctamente.");

    // KPIs demo
    this.totalFam += 1;
    this.totalAfe += 1;
    this.qs("#kpiFam").textContent = this.totalFam;
    this.qs("#kpiAfe").textContent = this.totalAfe;

    // Reset flujo + limpieza rápida
    this.familiarValid = false;
    this.afectadoValid = false;

    [
      "famNombre","famApellidos","famDNI","famTelefono","famEmail","famRelacion",
      "afeNombre","afeApellidos","afeDoc","afeEdad","afeEstado","afeNotas"
    ].forEach(id => { const el = this.qs("#"+id); if (el) el.value = ""; });

    this.mostrarPaso(1);
  }

  actualizarUIEstado() {
    // Guardar solo cuando ambos validados
    const btnGuardar = this.qs("#btnGuardarFinal");
    if (btnGuardar) btnGuardar.style.display = (this.familiarValid && this.afectadoValid) ? "inline-flex" : "none";

    // Bloqueos visuales + puntero en pasos
    this.qsa(".paso").forEach(p => {
      const pasoNum = parseInt(p.dataset.paso || "0", 10);
      let bloqueado = false;
      if (pasoNum === 2 && !this.familiarValid) bloqueado = true;
      if (pasoNum === 3 && !(this.familiarValid && this.afectadoValid)) bloqueado = true;
      p.classList.toggle("bloqueado", bloqueado);
      p.style.pointerEvents = bloqueado ? "none" : "auto";
    });

    // Marcar completados según flags
    this.qs(`[data-paso="1"]`)?.classList.toggle("completado", this.familiarValid);
    this.qs(`[data-paso="2"]`)?.classList.toggle("completado", this.afectadoValid);
  }
}

document.addEventListener("DOMContentLoaded", () => { window.app = new DemoApp(); });
