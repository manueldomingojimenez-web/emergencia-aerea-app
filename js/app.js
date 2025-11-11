// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestión Emerg cargado correctamente');
    
    // Inicializar funcionalidades
    initTabs();
    initSteps();
    initSaveButton();
    initFieldEffects();
});

// Funcionalidad para las pestañas principales
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
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
            steps.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            console.log('Paso cambiado a:', this.textContent);
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
            this.innerHTML = '✓ Guardando...';
            this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                alert('✅ Formulario guardado correctamente');
                this.innerHTML = 'Guardar';
                resetFormStyles();
            }, 1500);
        } else {
            alert('❌ Por favor, complete los siguientes campos obligatorios:\n• ' + emptyFields.join('\n• '));
        }
    });
}

// Efectos para los campos del formulario
function initFieldEffects() {
    const fields = document.querySelectorAll('input, select');
    
    fields.forEach(field => {
        field.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.style.borderColor = '#3498db';
        });
        
        field.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            
            if (this.classList.contains('required-field')) {
                if (this.value.trim()) {
                    this.style.borderColor = '#27ae60';
                } else {
                    this.style.borderColor = '#e74c3c';
                }
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
