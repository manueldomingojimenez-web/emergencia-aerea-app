// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestión Emerg cargado correctamente');
    
    // Inicializar funcionalidades
    initTabs();
    initSteps();
    initSectionTabs();
    initSaveButton();
    initFieldEffects();
});

// Funcionalidad para las pestañas principales
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            console.log('Pestaña cambiada a:', this.textContent);
        });
    });
}

// Funcionalidad para los pasos
function initSteps() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        step.addEventListener('click', function() {
            // Remover clase active de todos los pasos
            steps.forEach(s => s.classList.remove('active'));
            
            // Agregar clase active al paso clickeado
            this.classList.add('active');
            
            console.log('Paso cambiado a:', this.textContent);
        });
    });
}

// Funcionalidad para las pestañas de sección
function initSectionTabs() {
    const sectionTabs = document.querySelectorAll('.section-tab');
    
    sectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas de sección
            sectionTabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            console.log('Sección cambiada a:', this.textContent);
        });
    });
}

// Funcionalidad para el botón Guardar
function initSaveButton() {
    const saveButton = document.getElementById('guardarBtn');
    
    saveButton.addEventListener('click', function() {
        console.log('Botón Guardar clickeado');
        
        const requiredFields = document.querySelectorAll('.required-field');
        let isValid = true;
        let emptyFields = [];
        
        // Validar campos requeridos
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
                emptyFields.push(field.previousElementSibling.textContent);
            } else {
                field.style.borderColor = '#27ae60';
                field.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
            }
        });
        
        if (isValid) {
            // Simular envío exitoso
            this.innerHTML = '✓ Guardando...';
            this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                alert('✅ Formulario guardado correctamente');
                this.innerHTML = 'Guardar';
                resetFormStyles();
            }, 1500);
            
            console.log('Formulario válido, enviando datos...');
        } else {
            alert('❌ Por favor, complete los siguientes campos obligatorios:\n• ' + emptyFields.join('\n• '));
            console.log('Campos requeridos vacíos:', emptyFields);
        }
    });
}

// Efectos para los campos del formulario
function initFieldEffects() {
    const fields = document.querySelectorAll('input, select');
    
    fields.forEach(field => {
        // Efecto al enfocar
        field.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.style.borderColor = '#3498db';
        });
        
        // Efecto al perder el foco
        field.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            
            // Validación en tiempo real para campos requeridos
            if (this.classList.contains('required-field')) {
                if (this.value.trim()) {
                    this.style.borderColor = '#27ae60';
                } else {
                    this.style.borderColor = '#e74c3c';
                }
            }
        });
        
        // Efecto hover
        field.addEventListener('mouseenter', function() {
            if (document.activeElement !== this) {
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
        });
        
        field.addEventListener('mouseleave', function() {
            if (document.activeElement !== this) {
                this.style.boxShadow = 'none';
            }
        });
    });
}

// Función para resetear estilos del formulario
function resetFormStyles() {
    const fields = document.querySelectorAll('input, select');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

// Función para mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
