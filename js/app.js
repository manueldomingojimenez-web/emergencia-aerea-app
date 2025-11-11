class EmergenciaAereaApp {
    constructor() {
        this.pasoActual = 1;
        this.paso1Validado = false;
        this.paso2Validado = false;
        this.datosFamiliar = {};
        this.datosAfectado = {};
        this.registrosDemo = this.generarDatosDemo();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.setupFormLogic();
        this.loadUserInfo();
        this.cargarDashboardDemo();
        console.log('✅ Aplicación inicializada - Flujo por pasos');
    }

    setupNavigation() {
        // Navegación por pestañas principales
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.mostrarPestana(tab);
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Navegación por pasos dentro de Altas
        const pasos = document.querySelectorAll('.paso');
        pasos.forEach(paso => {
            paso.addEventListener('click', (e) => {
                const numeroPaso = parseInt(e.currentTarget.getAttribute('data-paso'));
                if (numeroPaso < this.pasoActual || (numeroPaso === 1 && this.paso1Validado) || 
                    (numeroPaso === 2 && this.paso2Validado)) {
                    this.cambiarPaso(numeroPaso);
                }
            });
        });
    }

    mostrarPestana(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Mostrar pestaña seleccionada
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Si vamos a consultas, cargar resultados
        if (tabName === 'consultas') {
            this.mostrarResultadosBusqueda(this.registrosDemo);
        }
    }

    cambiarPaso(nuevoPaso) {
        // Validar que se puede cambiar al paso
        if (nuevoPaso === 2 && !this.paso1Validado) {
            this.mostrarMensaje('Debe validar primero los datos del familiar', 'error');
            return;
        }
        if (nuevoPaso === 3 && !this.paso2Validado) {
            this.mostrarMensaje('Debe validar primero los datos del afectado', 'error');
            return;
        }

        // Ocultar todos los pasos
        document.querySelectorAll('.form-paso').forEach(paso => {
            paso.classList.remove('activo');
        });

        // Mostrar paso actual
        const pasoElement = document.getElementById(`paso-${this.obtenerNombrePaso(nuevoPaso)}`);
        if (pasoElement) {
            pasoElement.classList.add('activo');
        }

        // Actualizar estado visual de pasos
        this.actualizarProgresoPasos();

        this.pasoActual = nuevoPaso;

        // Si es paso 3, generar resumen
        if (nuevoPaso === 3) {
            this.generarResumenConfirmacion();
        }
    }

    obtenerNombrePaso(numeroPaso) {
        const pasos = {1: 'familiar', 2: 'afectado', 3: 'confirmacion'};
        return pasos[numeroPaso];
    }

    actualizarProgresoPasos() {
        const pasos = document.querySelectorAll('.paso');
        pasos.forEach((paso, index) => {
            const numeroPaso = index + 1;
            paso.classList.remove('activo', 'completado');
            
            if (numeroPaso === this.pasoActual) {
                paso.classList.add('activo');
            } else if ((numeroPaso === 1 && this.paso1Validado) || 
                      (numeroPaso === 2 && this.paso2Validado)) {
                paso.classList.add('completado');
            }
        });
    }

    validarPasoFamiliar() {
        const datos = this.obtenerDatosFamiliar();
        const errores = this.validarDatosFamiliar(datos);

        if (errores.length > 0) {
            this.mostrarMensaje(`Errores en datos del familiar:\n${errores.join('\n')}`, 'error');
            return;
        }

        this.datosFamiliar = datos;
        this.paso1Validado = true;
        this.mostrarMensaje('✅ Datos del familiar validados correctamente', 'success');
        this.cambiarPaso(2);
    }

    validarPasoAfectado() {
        const datos = this.obtenerDatosAfectado();
        const errores = this.validarDatosAfectado(datos);

        if (errores.length > 0) {
            this.mostrarMensaje(`Errores en datos del afectado:\n${errores.join('\n')}`, 'error');
            return;
        }

        this.datosAfectado = datos;
        this.paso2Validado = true;
        this.mostrarMensaje('✅ Datos del afectado validados correctamente', 'success');
        this.cambiarPaso(3);
    }

    retrocederPaso() {
        if (this.pasoActual > 1) {
            this.cambiarPaso(this.pasoActual - 1);
        }
    }

    obtenerDatosFamiliar() {
        return {
            Num_Control_Familiar: document.getElementById('Num_Control_Familiar').value,
            Apellidos: document.getElementById('Apellidos').value,
            Nombre: document.getElementById('Nombre').value,
            Edad: document.getElementById('Edad').value,
            Relac_AF: document.getElementById('Relac_AF').value,
            DNI_PASS: document.getElementById('DNI_PASS').value,
            Email: document.getElementById('Email').value,
            DirPerma: document.getElementById('DirPerma').value,
            Telef1: document.getElementById('Telef1').value,
            DirTemp: document.getElementById('DirTemp').value,
            Telef2: document.getElementById('Telef2').value,
            Nacionalidad: document.getElementById('Nacionalidad').value,
            Portavoz: document.getElementById('Portavoz').checked,
            Nombre_Port: document.getElementById('Nombre_Port').value,
            Nece_Esp: this.obtenerValoresSelectMultiple('Nece_Esp'),
            GR_SICOSO: document.getElementById('GR_SICOSO').value,
            COD_FAMILIAR: document.getElementById('COD_FAMILIAR').value
        };
    }

    obtenerDatosAfectado() {
        return {
            ID_Victima: document.getElementById('ID_Victima').value,
            Codigo_Victima: document.getElementById('Codigo_Victima').value,
            V_Apellidos: document.getElementById('V_Apellidos').value,
            V_Nombre: document.getElementById('V_Nombre').value,
            V_Edad: document.getElementById('V_Edad').value,
            ApellidoSoltera: document.getElementById('ApellidoSoltera').value,
            V_Nacionalidad: document.getElementById('V_Nacionalidad').value,
            V_telef: document.getElementById('V_telef').value,
            V_DirPerma: document.getElementById('V_DirPerma').value,
            V_Pais: document.getElementById('V_Pais').value,
            N_Vuelo: document.getElementById('N_Vuelo').value,
            Cia_Aerea: document.getElementById('Cia_Aerea').value,
            Tripulacion: document.getElementById('Tripulacion').checked,
            Origen: document.getElementById('Origen').value,
            Destino: document.getElementById('Destino').value,
            Acompañado: document.getElementById('Acompañado').checked,
            Num_Acomp: document.getElementById('Num_Acomp').value,
            Nombre_Grupo: document.getElementById('Nombre_Grupo').value,
            Nece_Espe: this.obtenerValoresSelectMultiple('Nece_Espe')
        };
    }

    validarDatosFamiliar(datos) {
        const errores = [];
        if (!datos.Num_Control_Familiar) errores.push('Nº Control Familia es obligatorio');
        if (!datos.Apellidos) errores.push('Apellidos del familiar son obligatorios');
        if (!datos.Nombre) errores.push('Nombre del familiar es obligatorio');
        return errores;
    }

    validarDatosAfectado(datos) {
        const errores = [];
        if (!datos.V_Apellidos) errores.push('Apellidos del afectado son obligatorios');
        if (!datos.N_Vuelo) errores.push('Número de vuelo es obligatorio');
        return errores;
    }

    generarResumenConfirmacion() {
        const resumenFamiliar = document.getElementById('resumen-familiar');
        const resumenAfectado = document.getElementById('resumen-afectado');

        resumenFamiliar.innerHTML = this.generarHTMLResumen(this.datosFamiliar);
        resumenAfectado.innerHTML = this.generarHTMLResumen(this.datosAfectado);
    }

    generarHTMLResumen(datos) {
        let html = '<div class="resumen-grid">';
        for (const [key, value] of Object.entries(datos)) {
            if (value && value !== '' && value !== false && (!Array.isArray(value) || value.length > 0)) {
                const label = this.obtenerLabelCampo(key);
                const valorFormateado = Array.isArray(value) ? value.join(', ') : value;
                html += `
                    <div class="resumen-item">
                        <strong>${label}:</strong> ${valorFormateado}
                    </div>
                `;
            }
        }
        html += '</div>';
        return html;
    }

    obtenerLabelCampo(key) {
        const labels = {
            'Num_Control_Familiar': 'Nº Control Familia',
            'V_Apellidos': 'Apellidos Afectado',
            'N_Vuelo': 'Número Vuelo'
            // ... agregar más mapeos
        };
        return labels[key] || key;
    }

    async guardarRegistroCompleto() {
        console.log('💾 Guardando registro completo...');
        
        try {
            // Simular guardado
            this.mostrarMensaje(
                '✅ Registro guardado correctamente en SharePoint\n\n' +
                `Familiar: ${this.datosFamiliar.Apellidos}, ${this.datosFamiliar.Nombre}\n` +
                `Afectado: ${this.datosAfectado.V_Apellidos}, ${this.datosAfectado.V_Nombre}\n` +
                `Vuelo: ${this.datosAfectado.N_Vuelo}`,
                'success'
            );

            // Reiniciar formulario
            this.reiniciarFormulario();
            
        } catch (error) {
            this.mostrarMensaje('❌ Error al guardar el registro', 'error');
        }
    }

    reiniciarFormulario() {
        this.pasoActual = 1;
        this.paso1Validado = false;
        this.paso2Validado = false;
        this.datosFamiliar = {};
        this.datosAfectado = {};
        
        this.limpiarFormularioCompleto();
        this.cambiarPaso(1);
        this.actualizarProgresoPasos();
    }

    // ... resto de métodos (búsqueda, dashboard, etc.) se mantienen igual
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new EmergenciaAereaApp();
});
