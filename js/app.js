// JavaScript básico para demo de funcionalidad
class DemoApp {
    constructor() {
        this.pasoActual = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.mostrarPaso(1);
        console.log('✅ Demo app inicializada');
    }

    setupEventListeners() {
        // Navegación por pestañas principales
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.mostrarPestana(tab);
            });
        });

        // Navegación por pasos (demo - siempre permite navegar)
        document.querySelectorAll('.paso').forEach(paso => {
            paso.addEventListener('click', (e) => {
                const nuevoPaso = parseInt(e.currentTarget.getAttribute('data-paso'));
                this.mostrarPaso(nuevoPaso);
            });
        });

        // Pestañas internas del formulario familiar
        document.querySelectorAll('.pestana-interna').forEach(pestana => {
            pestana.addEventListener('click', (e) => {
                const pestanaId = e.target.getAttribute('data-pestana');
                this.mostrarPestanaInterna(pestanaId);
            });
        });

        // Botones de acción
        document.getElementById('btnValidarFamiliar')?.addEventListener('click', () => {
            this.validarFamiliar();
        });

        document.getElementById('btnSiguienteAfectado')?.addEventListener('click', () => {
            this.mostrarPaso(2);
        });

        document.getElementById('btnValidarAfectado')?.addEventListener('click', () => {
            this.validarAfectado();
        });

        document.getElementById('btnSiguienteConfirmacion')?.addEventListener('click', () => {
            this.mostrarPaso(3);
        });

        document.getElementById('btnGuardarFinal')?.addEventListener('click', () => {
            this.guardarRegistro();
        });
    }

    mostrarPestana(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    mostrarPaso(numeroPaso) {
        this.pasoActual = numeroPaso;
        
        // Actualizar pasos visualmente
        document.querySelectorAll('.paso').forEach(paso => {
            paso.classList.remove('activo', 'completado');
        });

        // Marcar pasos anteriores como completados
        for (let i = 1; i < numeroPaso; i++) {
            document.querySelector(`[data-paso="${i}"]`).classList.add('completado');
        }

        // Marcar paso actual como activo
        document.querySelector(`[data-paso="${numeroPaso}"]`).classList.add('activo');

        // Mostrar contenido del paso
        document.querySelectorAll('.form-paso').forEach(paso => paso.classList.remove('activo'));
        document.getElementById(`paso-${this.getPasoName(numeroPaso)}`).classList.add('activo');

        // Mostrar primera pestaña interna por defecto
        if (numeroPaso === 1) {
            this.mostrarPestanaInterna('familiar-1');
        }
    }

    getPasoName(numero) {
        const nombres = {1: 'familiar', 2: 'afectado', 3: 'confirmacion'};
        return nombres[numero];
    }

    mostrarPestanaInterna(pestanaId) {
        document.querySelectorAll('.pestana-interna').forEach(p => p.classList.remove('activa'));
        document.querySelectorAll('.contenido-pestana').forEach(c => c.classList.remove('activa'));
        
        document.querySelector(`[data-pestana="${pestanaId}"]`).classList.add('activa');
        document.getElementById(pestanaId).classList.add('activa');
    }

    validarFamiliar() {
        alert('✅ DEMO: Datos del familiar validados correctamente');
        document.querySelector('[data-paso="1"]').classList.add('completado');
    }

    validarAfectado() {
        alert('✅ DEMO: Datos del afectado validados correctamente');
        document.querySelector('[data-paso="2"]').classList.add('completado');
    }

    guardarRegistro() {
        alert('💾 DEMO: Registro guardado correctamente en SharePoint');
        this.mostrarPaso(1); // Volver al inicio
    }
}

// Inicializar demo cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DemoApp();
});
