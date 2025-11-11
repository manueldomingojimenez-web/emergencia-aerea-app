class EmergenciaAereaApp {
    constructor() {
        this.currentSection = 'registro';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadUserInfo();
        console.log('✅ Aplicación inicializada correctamente');
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }

    setupEventListeners() {
        const btnGuardar = document.getElementById('btnGuardar');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.guardarRegistro();
            });
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.guardarRegistro();
            }
        });
    }

    async guardarRegistro() {
        console.log('📝 Intentando guardar registro...');
        
        const datosFamiliar = this.obtenerDatosFamiliar();
        const datosVictima = this.obtenerDatosVictima();
        
        if (!this.validarDatos(datosFamiliar, datosVictima)) {
            this.mostrarMensaje('Por favor, complete los campos obligatorios', 'error');
            return;
        }

        try {
            this.mostrarMensaje('Registro guardado correctamente (demo)', 'success');
            this.limpiarFormulario();
        } catch (error) {
            console.error('Error al guardar:', error);
            this.mostrarMensaje('Error al guardar el registro', 'error');
        }
    }

    obtenerDatosFamiliar() {
        return {
            Num_Control_Familiar: document.getElementById('Num_Control_Familiar').value,
            Apellidos: document.getElementById('Apellidos').value,
            Nombre: document.getElementById('Nombre').value
        };
    }

    obtenerDatosVictima() {
        return {
            N_Vuelo: document.getElementById('N_Vuelo').value,
            V_Apellidos: document.getElementById('V_Apellidos').value,
            V_Nombre: document.getElementById('V_Nombre').value
        };
    }

    validarDatos(familiar, victima) {
        return familiar.Apellidos && familiar.Nombre && victima.V_Apellidos;
    }

    limpiarFormulario() {
        document.getElementById('Num_Control_Familiar').value = '';
        document.getElementById('Apellidos').value = '';
        document.getElementById('Nombre').value = '';
        document.getElementById('N_Vuelo').value = '';
        document.getElementById('V_Apellidos').value = '';
        document.getElementById('V_Nombre').value = '';
    }

    mostrarMensaje(mensaje, tipo) {
        alert(`[${tipo.toUpperCase()}] ${mensaje}`);
    }

    loadUserInfo() {
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = 'Agente - AENA';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmergenciaAereaApp();
});
