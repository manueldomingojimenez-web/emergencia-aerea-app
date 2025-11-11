// JavaScript mejorado para demo con validación y gating de pasos
class DemoApp {
  constructor() {
    this.pasoActual = 1;
    this.familiarValid = false;
    this.afectadoValid = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.mostrarPestana("Altas");
    this.mostrarPaso(1);
    this.actualizarUIEstado();
    console.log("✅ Demo app inicializada (revisada)");
  }

  // Utilidades seguras de selección
  qs(sel) { return document.querySelector(sel); }
  qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  setupEventListeners() {
    // Tabs principales
    this.qsa(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget?.dataset?.tab;
        if (tab) this.mostrarPestana(tab);
      });
    });

    // Pasos (stepper)
    this.qsa(".paso").forEach(paso => {
      paso.addEventListener("click", (e) => {
        const nuevoPaso = parseInt(e.currentTarget?.dataset?.paso || "0", 10);
        if (!nuevoPaso) return;
        // Gating: impide saltar si no está validado lo requerido
        if (nuevoPaso === 2 && !this.familiarValid) {
          alert("⚠️ Debes validar los datos del Familiar antes de pasar a Afectado.");
          return;
        }
        if (nuevoPaso === 3 && !(this.familiarValid && this.afectadoValid)) {
          alert("⚠️ Debes validar Familiar y Afectado antes de ir a Confirmación.");
          return;
        }
        this.mostrarPaso(nuevoPaso);
      });
    });

    // Pestañas internas del formulario Familiar (o las que tengas)
    this.qsa(".pestana-interna").forEach(pestana => {
      pestana.addEventListener("click", (e) => {
        const id = e.currentTarget?.dataset?.pestana;
        if (id) this.mostrarPestanaInterna(id);
      });
    });

    // Botones de acción
    this.qs("#btnValidarFamiliar")?.addEventListener("click", () => this.validarFamiliar());
    this.qs("#btnValidarAfectado")?.addEventListener("click", () => this.validarAfectado());
    this.qs("#btnSiguienteAfectado")?.addEventListener("click", () => this.mostrarPaso(2));
    this.qs("#btnSiguienteConfirmacion")?.addEventListener("click", () => this.mostrarPaso(3));
    this.qs("#btnGuardarFinal")?.addEventListener("click", () => this.guardarRegistro());
  }

  // Tabs principales
  mostrarPestana(tabName) {
    this.qsa(".tab-btn").forEach(btn => btn.classList.remove("active"));
    this.qsa(".tab-content").forEach(tab => tab.classList.remove("active"));

    this.qs(`[data-tab="${tabName}"]`)?.classList.add("active");
    this.qs(`#${tabName}`)?.classList.add("active");
  }

  // Stepper
  mostrarPaso(numeroPaso) {
    this.pasoActual = numeroPaso;

    // Reset estados visuales
    this.qsa(".paso").forEach(paso => paso.classList.remove("activo", "completado", "bloqueado"));

    // Marcar completados según validaciones
    // Paso 1 completo si familiarValid; paso 2 completo si afectadoValid
    if (this.familiarValid) this.qs(`[data-paso="1"]`)?.classList.add("completado");
    if (this.afectadoValid) this.qs(`[data-paso="2"]`)?.classList.add("completado");

    // Bloqueos según estado
    if (!this.familiarValid) this.qs(`[data-paso="2"]`)?.classList.add("bloqueado");
    if (!(this.familiarValid && this.afectadoValid)) this.qs(`[data-paso="3"]`)?.classList.add("bloqueado");

    // Activo actual
    this.qs(`[data-paso="${numeroPaso}"]`)?.classList.add("activo");

    // Mostrar contenido del paso
    this.qsa(".form-paso").forEach(p => p.classList.remove("activo"));
    const contenidoId = `paso-${this.getPasoName(numeroPaso)}`;
    this.qs(`#${contenidoId}`)?.classList.add("activo");

    // Si entramos al paso 1, mostrar la primera pestaña interna por defecto
    if (numeroPaso === 1) this.mostrarPestanaInterna("familiar-1");

    this.actualizarUIEstado();
  }

  getPasoName(numero) {
    const nombres = { 1: "familiar", 2: "afectado", 3: "confirmacion" };
    return nombres[numero];
  }

  // Pestañas internas (subtabs)
  mostrarPestanaInterna(pestanaId) {
    this.qsa(".pestana-interna").forEach(p => p.classList.remove("activa"));
    this.qsa(".contenido-pestana").forEach(c => c.classList.remove("activa"));

    this.qs(`[data-pestana="${pestanaId}"]`)?.classList.add("activa");
    this.qs(`#${pestanaId}`)?.classList.add("activa");
  }

  // Validaciones
  validarFamiliar() {
    // Aquí puedes meter validaciones reales de formulario (inputs requeridos, etc.)
    this.familiarValid = true;
    alert("✅ Familiar validado correctamente.");
    // Tras validar, permitir acceder a Afectado, pero NO obligamos a saltar
    this.actualizarUIEstado();
  }

  validarAfectado() {
    // Validaciones reales aquí
    if (!this.familiarValid) {
      alert("⚠️ Primero valida los datos del Familiar.");
      return;
    }
    this.afectadoValid = true;
    alert("✅ Afectado validado correctamente.");
    this.actualizarUIEstado();
  }

  // Guardado final
  guardarRegistro() {
    if (!(this.familiarValid && this.afectadoValid)) {
      alert("⚠️ Debes validar Familiar y Afectado antes de guardar.");
      return;
    }
    alert("💾 DEMO: Registro guardado correctamente en SharePoint");
    // Reset flujo para nueva alta
    this.familiarValid = false;
    this.afectadoValid = false;
    this.mostrarPaso(1);
  }

  // Refresca botones/visibilidad según estado
  actualizarUIEstado() {
    // Botón Guardar solo cuando ambos validados
    const btnGuardar = this.qs("#btnGuardarFinal");
    if (btnGuardar) {
      btnGuardar.style.display = (this.familiarValid && this.afectadoValid) ? "inline-flex" : "none";
    }

    // (Opcional) deshabilitar clic en pasos bloqueados visualmente
    this.qsa(".paso").forEach(p => {
      const pasoNum = parseInt(p.dataset.paso || "0", 10);
      let bloqueado = false;
      if (pasoNum === 2 && !this.familiarValid) bloqueado = true;
      if (pasoNum === 3 && !(this.familiarValid && this.afectadoValid)) bloqueado = true;
      p.style.pointerEvents = bloqueado ? "none" : "auto";
      p.style.opacity = bloqueado ? "0.5" : "1";
    });
  }
}

// Inicializar cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  window.app = new DemoApp();
});
