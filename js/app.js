// JavaScript para funcionalidad de pestañas y navegación
class DemoApp {
    constructor() {
        this.pasoActual = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.mostrarPaso(1);
        console.log('✅ Demo app inicializada - CSS garantizado');
    }

    setupEventListeners() {
        // Pestañas principales
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.mostrarPestana(tab);
            });
        });

        // Navegación por pasos
        document.querySelectorAll('.paso').forEach(paso => {
            paso.addEventListener('click', (e) => {
                const nuevoPaso = parseInt(e.currentTarget.getAttribute('data-paso'));
                this.mostrarPaso(nuevoPaso);
            });
        });

        // Pestañas internas
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

        document.getElementById('btnAnteriorFamiliar')?.addEventListener('click', () => {
            this.mostrarPaso(1);
        });

        document.getElementById('btnAnteriorAfectado')?.addEventListener('click', () => {
            this.mostrarPaso(2);
        });

        document.getElementById('btnGuardarFinal')?.addEventListener('click', () => {
            this.guardarRegistro();
        });

        // Lógica del portavoz
        const portavozCheckbox = document.getElementById('Portavoz');
        const nombrePortavozInput = document.getElementById('Nombre_Port');
        
        if (portavozCheckbox && nombrePortavozInput) {
            portavozCheckbox.addEventListener('change', () => {
                nombrePortavozInput.disabled = !portavozCheckbox.checked;
                if (!portavozCheckbox.checked) {
                    nombrePortavozInput.value = '';
                }
            });
        }
    }

    mostrarPestana(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        // Mostrar pestaña seleccionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    mostrarPaso(numeroPaso) {
        this.pasoActual = numeroPaso;
        
        // Actualizar estado visual de pasos
        document.querySelectorAll('.paso').forEach(paso => {
            paso.classList.remove('activo', 'completado');
        });

        // Marcar pasos anteriores como completados
        for (let i = 1; i < numeroPaso; i++) {
            document.querySelector(`[data-paso="${i}"]`).classList.add('completado');
        }

        // Marcar paso actual como activo
        document.querySelector(`[data-paso="${numeroPaso}"]`).classList.add('activo');

        // Ocultar todos los pasos de formulario
        document.querySelectorAll('.form-paso').forEach(paso => {
            paso.classList.remove('activo');
        });

        // Mostrar paso actual
        const pasoElement = document.getElementById(`paso-${this.getPasoName(numeroPaso)}`);
        if (pasoElement) {
            pasoElement.classList.add('activo');
        }

        // Mostrar primera pestaña interna por defecto
        if (numeroPaso === 1) {
            this.mostrarPestanaInterna('familiar-1');
        } else if (numeroPaso === 2) {
            this.mostrarPestanaInterna('afectado-1');
        }
    }

    getPasoName(numero) {
        const nombres = {1: 'familiar', 2: 'afectado', 3: 'confirmacion'};
        return nombres[numero];
    }

    mostrarPestanaInterna(pestanaId) {
        // Ocultar todas las pestañas internas
        document.querySelectorAll('.pestana-interna').forEach(p => {
            p.classList.remove('activa');
        });
        document.querySelectorAll('.contenido-pestana').forEach(c => {
            c.classList.remove('activa');
        });
        
        // Mostrar pestaña seleccionada
        const pestanaBtn = document.querySelector(`[data-pestana="${pestanaId}"]`);
        const pestanaContent = document.getElementById(pestanaId);
        
        if (pestanaBtn && pestanaContent) {
            pestanaBtn.classList.add('activa');
            pestanaContent.classList.add('activa');
        }
    }

    validarFamiliar() {
        const numControl = document.getElementById('Num_Control_Familiar').value;
        const apellidos = document.getElementById('Apellidos').value;
        const nombre = document.getElementById('Nombre').value;
        
        if (!numControl || !apellidos || !nombre) {
            alert('❌ Complete los campos obligatorios del familiar');
            return;
        }
        
        alert('✅ Datos del familiar validados correctamente');
        document.querySelector('[data-paso="1"]').classList.add('completado');
    }

    validarAfectado() {
        const apellidos = document.getElementById('V_Apellidos').value;
        const nombre = document.getElementById('V_Nombre').value;
        const vuelo = document.getElementById('N_Vuelo').value;
        
        if (!apellidos || !nombre || !vuelo) {
            alert('❌ Complete los campos obligatorios del afectado');
            return;
        }
        
        alert('✅ Datos del afectado validados correctamente');
        document.querySelector('[data-paso="2"]').classList.add('completado');
    }

    guardarRegistro() {
        alert('💾 DEMO: Registro guardado correctamente en SharePoint\n\nLos datos se han almacenado en las listas correspondientes.');
        this.mostrarPaso(1); // Volver al inicio
        
        // Limpiar formulario
        document.querySelectorAll('input, select').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else if (element.type === 'select-multiple') {
                Array.from(element.options).forEach(option => option.selected = false);
            } else {
                element.value = '';
            }
        });
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DemoApp();
});
